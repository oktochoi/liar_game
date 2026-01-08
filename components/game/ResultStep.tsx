'use client';

import { GameState, GameAction } from '@/lib/gameReducer';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function ResultStep({ state, dispatch }: Props) {
  const lastResult = state.history[state.history.length - 1];
  
  const voteCounts = new Map<string, number>();
  state.players.forEach(p => voteCounts.set(p.id, 0));
  lastResult.votes.forEach(vote => {
    voteCounts.set(vote.targetId, (voteCounts.get(vote.targetId) || 0) + 1);
  });

  const eliminatedPlayer = state.players.find(p => p.id === lastResult.eliminatedId);
  const eliminatedRole = state.roles.find(r => r.playerId === lastResult.eliminatedId);

  const liarPlayer = state.players.find(p => p.id === lastResult.liarId);
  const spyPlayer = state.players.find(p => p.id === lastResult.spyId);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center justify-center gap-2">
          <i className="ri-trophy-line text-yellow-500 text-2xl sm:text-3xl"></i>
          게임 결과
        </h2>

        <div className={`inline-block px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xl sm:text-2xl mb-6 sm:mb-8 ${
          lastResult.winner === 'citizen'
            ? 'bg-blue-100 text-blue-700'
            : lastResult.winner === 'liar'
            ? 'bg-red-100 text-red-700'
            : lastResult.winner === 'spy'
            ? 'bg-orange-100 text-orange-700'
            : 'bg-gray-100 text-gray-700'
        }`}>
          {lastResult.winner === 'citizen' && '🎉 시민 승리!'}
          {lastResult.winner === 'liar' && '😈 라이어 승리!'}
          {lastResult.winner === 'spy' && '🕵️ 스파이 승리!'}
          {lastResult.winner === 'none' && '무승부'}
        </div>

        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="font-bold text-gray-800 mb-3 sm:mb-4 text-base sm:text-lg">제거된 플레이어</h3>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{eliminatedPlayer?.name}</p>
            <div className={`inline-block px-4 sm:px-6 py-2 rounded-full font-bold text-sm sm:text-base ${
              eliminatedRole?.role === 'citizen'
                ? 'bg-blue-100 text-blue-700'
                : eliminatedRole?.role === 'liar'
                ? 'bg-red-100 text-red-700'
                : 'bg-orange-100 text-orange-700'
            }`}>
              {eliminatedRole?.role === 'citizen' && '시민'}
              {eliminatedRole?.role === 'liar' && '라이어'}
              {eliminatedRole?.role === 'spy' && '스파이'}
            </div>
            <p className="text-base sm:text-lg text-gray-600 mt-2 sm:mt-3">
              득표수: <span className="font-bold text-purple-600">{voteCounts.get(lastResult.eliminatedId) || 0}표</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-blue-600 mb-2">시민의 단어</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-700">{lastResult.mainWord}</p>
          </div>
          {lastResult.spyWord && (
            <div className="bg-orange-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-orange-600 mb-2">스파이의 단어</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-700">{lastResult.spyWord}</p>
            </div>
          )}
        </div>

        <div className="bg-purple-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="font-bold text-purple-800 mb-3 sm:mb-4 text-base sm:text-lg">역할 공개</h3>
          <div className="space-y-2">
            {state.players.map((player) => {
              const role = state.roles.find(r => r.playerId === player.id);
              return (
                <div
                  key={player.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-lg"
                >
                  <span className="font-medium text-gray-700 text-sm sm:text-base">{player.name}</span>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold ${
                      role?.role === 'citizen'
                        ? 'bg-blue-100 text-blue-700'
                        : role?.role === 'liar'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {role?.role === 'citizen' && '시민'}
                      {role?.role === 'liar' && '라이어'}
                      {role?.role === 'spy' && '스파이'}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {voteCounts.get(player.id) || 0}표
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => dispatch({ type: 'NEXT_ROUND' })}
          className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg whitespace-nowrap cursor-pointer"
        >
          다음 라운드
        </button>
        <button
          onClick={() => dispatch({ type: 'VIEW_HISTORY' })}
          className="px-4 sm:px-6 py-3 sm:py-4 bg-white text-purple-600 border-2 border-purple-600 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-purple-50 transition-all whitespace-nowrap cursor-pointer"
        >
          기록 보기
        </button>
      </div>
    </div>
  );
}
