export type GameMode = 'liar' | 'spy' | 'hybrid';
export type Role = 'citizen' | 'liar' | 'spy';
export type Category = 'food' | 'animal' | 'place' | 'job' | 'movie' | 'random';
export type GameStep = 'setup' | 'reveal' | 'discuss' | 'vote' | 'result' | 'history';

export interface Player {
  id: string;
  name: string;
}

export interface Settings {
  mode: GameMode;
  category: Category;
  durationSec: number;
  allowSelfVote: boolean;
  hideWordDuringDiscuss: boolean;
  spySimilarity: 'high' | 'medium' | 'low';
  liarGuessMode: boolean;
}

export interface RoleAssignment {
  playerId: string;
  role: Role;
  word?: string;
}

export interface Round {
  roundNo: number;
  mainWord: string;
  spyWord?: string;
  category: string;
}

export interface Vote {
  voterId: string;
  targetId: string;
}

export interface RoundHistory {
  roundNo: number;
  liarId?: string;
  spyId?: string;
  mainWord: string;
  spyWord?: string;
  eliminatedId: string;
  winner: 'citizen' | 'liar' | 'spy' | 'none';
  votes: Vote[];
}

export interface GameState {
  step: GameStep;
  players: Player[];
  settings: Settings;
  roles: RoleAssignment[];
  round: Round | null;
  revealIndex: number;
  votes: Vote[];
  history: RoundHistory[];
  timerStarted: boolean;
  timerPaused: boolean;
  elapsedTime: number;
}

export type GameAction =
  | { type: 'ADD_PLAYER'; name: string }
  | { type: 'REMOVE_PLAYER'; id: string }
  | { type: 'UPDATE_PLAYER_NAME'; id: string; name: string }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<Settings> }
  | { type: 'START_GAME' }
  | { type: 'NEXT_REVEAL' }
  | { type: 'START_DISCUSS' }
  | { type: 'START_TIMER' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'UPDATE_TIMER'; elapsed: number }
  | { type: 'START_VOTE' }
  | { type: 'CAST_VOTE'; voterId: string; targetId: string }
  | { type: 'SHOW_RESULT' }
  | { type: 'NEXT_ROUND' }
  | { type: 'VIEW_HISTORY' }
  | { type: 'BACK_TO_SETUP' }
  | { type: 'LIAR_GUESS'; wordIndex: number };

export const initialState: GameState = {
  step: 'setup',
  players: [],
  settings: {
    mode: 'liar',
    category: 'random',
    durationSec: 180,
    allowSelfVote: false,
    hideWordDuringDiscuss: true,
    spySimilarity: 'medium',
    liarGuessMode: true,
  },
  roles: [],
  round: null,
  revealIndex: 0,
  votes: [],
  history: [],
  timerStarted: false,
  timerPaused: false,
  elapsedTime: 0,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_PLAYER':
      return {
        ...state,
        players: [...state.players, { id: Date.now().toString(), name: action.name }],
      };

    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter(p => p.id !== action.id),
      };

    case 'UPDATE_PLAYER_NAME':
      return {
        ...state,
        players: state.players.map(p =>
          p.id === action.id ? { ...p, name: action.name } : p
        ),
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.settings },
      };

    case 'START_GAME': {
      const { roles, round } = assignRoles(state.players, state.settings);
      return {
        ...state,
        step: 'reveal',
        roles,
        round,
        revealIndex: 0,
        votes: [],
        timerStarted: false,
        timerPaused: false,
        elapsedTime: 0,
      };
    }

    case 'NEXT_REVEAL':
      if (state.revealIndex < state.players.length - 1) {
        return { ...state, revealIndex: state.revealIndex + 1 };
      }
      return { ...state, step: 'discuss' };

    case 'START_DISCUSS':
      return { ...state, step: 'discuss' };

    case 'START_TIMER':
      return { ...state, timerStarted: true, timerPaused: false };

    case 'PAUSE_TIMER':
      return { ...state, timerPaused: !state.timerPaused };

    case 'RESET_TIMER':
      return { ...state, elapsedTime: 0, timerStarted: false, timerPaused: false };

    case 'UPDATE_TIMER':
      return { ...state, elapsedTime: action.elapsed };

    case 'START_VOTE':
      return { ...state, step: 'vote', votes: [] };

    case 'CAST_VOTE':
      return {
        ...state,
        votes: [...state.votes, { voterId: action.voterId, targetId: action.targetId }],
      };

    case 'SHOW_RESULT': {
      const result = calculateResult(state);
      return {
        ...state,
        step: 'result',
        history: [...state.history, result],
      };
    }

    case 'NEXT_ROUND': {
      const { roles, round } = assignRoles(state.players, state.settings);
      return {
        ...state,
        step: 'reveal',
        roles,
        round: {
          ...round,
          roundNo: (state.round?.roundNo || 0) + 1,
        },
        revealIndex: 0,
        votes: [],
        timerStarted: false,
        timerPaused: false,
        elapsedTime: 0,
      };
    }

    case 'VIEW_HISTORY':
      return { ...state, step: 'history' };

    case 'BACK_TO_SETUP':
      return {
        ...initialState,
        players: state.players,
        settings: state.settings,
        history: state.history,
      };

    default:
      return state;
  }
}

function assignRoles(players: Player[], settings: Settings): { roles: RoleAssignment[]; round: Round } {
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  const roles: RoleAssignment[] = [];
  
  const { mainWord, spyWord, category } = getWords(settings.category, settings.spySimilarity);
  
  if (settings.mode === 'liar') {
    const liarIndex = Math.floor(Math.random() * shuffled.length);
    shuffled.forEach((player, index) => {
      roles.push({
        playerId: player.id,
        role: index === liarIndex ? 'liar' : 'citizen',
        word: index === liarIndex ? undefined : mainWord,
      });
    });
  } else if (settings.mode === 'spy') {
    const spyIndex = Math.floor(Math.random() * shuffled.length);
    shuffled.forEach((player, index) => {
      roles.push({
        playerId: player.id,
        role: index === spyIndex ? 'spy' : 'citizen',
        word: index === spyIndex ? spyWord : mainWord,
      });
    });
  } else {
    const liarIndex = Math.floor(Math.random() * shuffled.length);
    let spyIndex = Math.floor(Math.random() * shuffled.length);
    while (spyIndex === liarIndex) {
      spyIndex = Math.floor(Math.random() * shuffled.length);
    }
    shuffled.forEach((player, index) => {
      if (index === liarIndex) {
        roles.push({ playerId: player.id, role: 'liar', word: undefined });
      } else if (index === spyIndex) {
        roles.push({ playerId: player.id, role: 'spy', word: spyWord });
      } else {
        roles.push({ playerId: player.id, role: 'citizen', word: mainWord });
      }
    });
  }

  return {
    roles,
    round: {
      roundNo: 1,
      mainWord,
      spyWord: settings.mode !== 'liar' ? spyWord : undefined,
      category,
    },
  };
}

function getWords(category: Category, similarity: string): { mainWord: string; spyWord: string; category: string } {
  const categories = category === 'random' 
    ? ['food', 'animal', 'place', 'job', 'movie'] 
    : [category];
  
  const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
  const wordBank = getWordBank(selectedCategory);
  const mainWord = wordBank[Math.floor(Math.random() * wordBank.length)];
  const spyWord = getSpyWord(mainWord, selectedCategory, similarity);
  
  return { mainWord, spyWord, category: selectedCategory };
}

function calculateResult(state: GameState): RoundHistory {
  const voteCounts = new Map<string, number>();
  state.players.forEach(p => voteCounts.set(p.id, 0));
  
  state.votes.forEach(vote => {
    voteCounts.set(vote.targetId, (voteCounts.get(vote.targetId) || 0) + 1);
  });

  let maxVotes = 0;
  let eliminatedId = '';
  voteCounts.forEach((count, playerId) => {
    if (count > maxVotes) {
      maxVotes = count;
      eliminatedId = playerId;
    }
  });

  const eliminatedRole = state.roles.find(r => r.playerId === eliminatedId);
  let winner: 'citizen' | 'liar' | 'spy' | 'none' = 'none';

  if (eliminatedRole?.role === 'liar' || eliminatedRole?.role === 'spy') {
    winner = 'citizen';
  } else if (eliminatedRole?.role === 'citizen') {
    if (state.settings.mode === 'liar') {
      winner = 'liar';
    } else if (state.settings.mode === 'spy') {
      winner = 'spy';
    } else {
      winner = 'liar';
    }
  }

  return {
    roundNo: state.round?.roundNo || 1,
    liarId: state.roles.find(r => r.role === 'liar')?.playerId,
    spyId: state.roles.find(r => r.role === 'spy')?.playerId,
    mainWord: state.round?.mainWord || '',
    spyWord: state.round?.spyWord,
    eliminatedId,
    winner,
    votes: state.votes,
  };
}

function getWordBank(category: string): string[] {
  const banks: Record<string, string[]> = {
    food: ['사과', '바나나', '피자', '햄버거', '김치', '라면', '치킨', '스테이크', '초밥', '파스타', '샐러드', '케이크'],
    animal: ['강아지', '고양이', '사자', '호랑이', '코끼리', '기린', '펭귄', '돌고래', '독수리', '토끼', '여우', '곰'],
    place: ['학교', '병원', '공원', '도서관', '카페', '영화관', '공항', '지하철', '백화점', '박물관', '체육관', '해변'],
    job: ['의사', '선생님', '경찰', '소방관', '요리사', '변호사', '가수', '배우', '운동선수', '프로그래머', '디자이너', '작가'],
    movie: ['타이타닉', '어벤져스', '해리포터', '반지의제왕', '스타워즈', '인터스텔라', '기생충', '겨울왕국', '라이온킹', '토이스토리', '인셉션', '매트릭스'],
  };
  return banks[category] || banks.food;
}

function getSpyWord(mainWord: string, category: string, similarity: string): string {
  const spyMaps: Record<string, Record<string, string[]>> = {
    food: {
      '사과': ['배', '복숭아', '토마토'],
      '바나나': ['옥수수', '고구마', '감자'],
      '피자': ['파스타', '햄버거', '샌드위치'],
      '햄버거': ['샌드위치', '핫도그', '피자'],
      '김치': ['깍두기', '젓갈', '장아찌'],
      '라면': ['우동', '쌀국수', '파스타'],
      '치킨': ['오리', '삼겹살', '갈비'],
      '스테이크': ['삼겹살', '갈비', '불고기'],
      '초밥': ['회', '연어', '참치'],
      '파스타': ['스파게티', '라면', '우동'],
      '샐러드': ['비빔밥', '쌈', '나물'],
      '케이크': ['빵', '쿠키', '마카롱'],
    },
    animal: {
      '강아지': ['고양이', '토끼', '햄스터'],
      '고양이': ['강아지', '호랑이', '사자'],
      '사자': ['호랑이', '표범', '치타'],
      '호랑이': ['사자', '표범', '고양이'],
      '코끼리': ['하마', '코뿔소', '기린'],
      '기린': ['코끼리', '얼룩말', '사슴'],
      '펭귄': ['오리', '백조', '갈매기'],
      '돌고래': ['고래', '상어', '물개'],
      '독수리': ['매', '까마귀', '부엉이'],
      '토끼': ['다람쥐', '햄스터', '강아지'],
      '여우': ['늑대', '개', '너구리'],
      '곰': ['판다', '코알라', '너구리'],
    },
    place: {
      '학교': ['학원', '도서관', '대학교'],
      '병원': ['약국', '보건소', '한의원'],
      '공원': ['놀이터', '산', '정원'],
      '도서관': ['서점', '학교', '독서실'],
      '카페': ['레스토랑', '베이커리', '찻집'],
      '영화관': ['극장', '공연장', '콘서트홀'],
      '공항': ['항구', '기차역', '터미널'],
      '지하철': ['버스', '기차', '전철'],
      '백화점': ['마트', '시장', '쇼핑몰'],
      '박물관': ['미술관', '전시관', '갤러리'],
      '체육관': ['운동장', '헬스장', '수영장'],
      '해변': ['바다', '강', '호수'],
    },
    job: {
      '의사': ['간호사', '약사', '한의사'],
      '선생님': ['교수', '강사', '학원강사'],
      '경찰': ['군인', '경비원', '소방관'],
      '소방관': ['경찰', '구급대원', '군인'],
      '요리사': ['제빵사', '바리스타', '영양사'],
      '변호사': ['판사', '검사', '법무사'],
      '가수': ['배우', '댄서', '뮤지션'],
      '배우': ['가수', '모델', '코미디언'],
      '운동선수': ['코치', '심판', '트레이너'],
      '프로그래머': ['개발자', '디자이너', '기획자'],
      '디자이너': ['일러스트레이터', '작가', '건축가'],
      '작가': ['기자', '편집자', '시인'],
    },
    movie: {
      '타이타닉': ['노트북', '어바웃타임', '러브액츄얼리'],
      '어벤져스': ['저스티스리그', '엑스맨', '스파이더맨'],
      '해리포터': ['반지의제왕', '나니아연대기', '퍼시잭슨'],
      '반지의제왕': ['해리포터', '호빗', '나니아연대기'],
      '스타워즈': ['스타트렉', '가디언즈오브갤럭시', '듄'],
      '인터스텔라': ['그래비티', '마션', '컨택트'],
      '기생충': ['살인의추억', '괴물', '설국열차'],
      '겨울왕국': ['모아나', '라푼젤', '인어공주'],
      '라이온킹': ['정글북', '타잔', '니모를찾아서'],
      '토이스토리': ['몬스터주식회사', '인사이드아웃', '업'],
      '인셉션': ['매트릭스', '셔터아일랜드', '메멘토'],
      '매트릭스': ['인셉션', '블레이드러너', '토탈리콜'],
    },
  };

  const categoryMap = spyMaps[category] || {};
  const spyWords = categoryMap[mainWord] || Object.values(categoryMap).flat();
  
  if (spyWords.length === 0) {
    const allWords = getWordBank(category);
    return allWords.filter(w => w !== mainWord)[0] || mainWord;
  }

  return spyWords[Math.floor(Math.random() * spyWords.length)];
}
