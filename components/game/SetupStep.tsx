'use client';

import { useState } from 'react';
import { GameState, GameAction, GameMode, Category } from '@/lib/gameReducer';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function SetupStep({ state, dispatch }: Props) {
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      dispatch({ type: 'ADD_PLAYER', name: newPlayerName.trim() });
      setNewPlayerName('');
    }
  };

  const handleStartGame = () => {
    if (state.players.length < 3) {
      alert('최소 3명의 플레이어가 필요합니다.');
      return;
    }
    dispatch({ type: 'START_GAME' });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
          <i className="ri-user-add-line text-purple-600 text-xl sm:text-2xl"></i>
          플레이어 관리
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
            placeholder="플레이어 이름 입력"
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          />
          <button
            onClick={handleAddPlayer}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium whitespace-nowrap cursor-pointer text-sm sm:text-base"
          >
            추가
          </button>
        </div>

        <div className="space-y-2">
          {state.players.map((player) => (
            <div key={player.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={player.name}
                onChange={(e) => dispatch({ type: 'UPDATE_PLAYER_NAME', id: player.id, name: e.target.value })}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <button
                onClick={() => dispatch({ type: 'REMOVE_PLAYER', id: player.id })}
                className="w-9 h-9 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <i className="ri-delete-bin-line text-lg"></i>
              </button>
            </div>
          ))}
        </div>

        {state.players.length < 3 && (
          <p className="text-sm text-amber-600 mt-3 flex items-center gap-2">
            <i className="ri-error-warning-line"></i>
            최소 3명의 플레이어가 필요합니다 (현재: {state.players.length}명)
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
          <i className="ri-settings-3-line text-purple-600 text-xl sm:text-2xl"></i>
          게임 설정
        </h2>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">게임 모드</label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {(['liar', 'spy', 'hybrid'] as GameMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => dispatch({ type: 'UPDATE_SETTINGS', settings: { mode } })}
                  className={`px-2 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer text-xs sm:text-sm md:text-base ${
                    state.settings.mode === mode
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {mode === 'liar' ? '라이어' : mode === 'spy' ? '스파이' : '하이브리드'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">카테고리</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {(['food', 'animal', 'place', 'job', 'movie', 'random'] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => dispatch({ type: 'UPDATE_SETTINGS', settings: { category: cat } })}
                  className={`px-2 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer text-xs sm:text-sm md:text-base ${
                    state.settings.category === cat
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'food' ? '음식' : cat === 'animal' ? '동물' : cat === 'place' ? '장소' : cat === 'job' ? '직업' : cat === 'movie' ? '영화' : '랜덤'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              토론 시간: {Math.floor(state.settings.durationSec / 60)}분 {state.settings.durationSec % 60}초
            </label>
            <input
              type="range"
              min="60"
              max="600"
              step="30"
              value={state.settings.durationSec}
              onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', settings: { durationSec: parseInt(e.target.value) } })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!state.settings.allowSelfVote}
                onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', settings: { allowSelfVote: !e.target.checked } })}
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700">자기 자신 투표 금지</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={state.settings.hideWordDuringDiscuss}
                onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', settings: { hideWordDuringDiscuss: e.target.checked } })}
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700">토론 중 단어 숨기기</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={state.settings.liarGuessMode}
                onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', settings: { liarGuessMode: e.target.checked } })}
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700">라이어 단어 맞추기 모드</span>
            </label>
          </div>

          {(state.settings.mode === 'spy' || state.settings.mode === 'hybrid') && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">스파이 단어 유사도</label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {(['high', 'medium', 'low'] as const).map((sim) => (
                  <button
                    key={sim}
                    onClick={() => dispatch({ type: 'UPDATE_SETTINGS', settings: { spySimilarity: sim } })}
                    className={`px-2 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer text-xs sm:text-sm md:text-base ${
                      state.settings.spySimilarity === sim
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sim === 'high' ? '높음' : sim === 'medium' ? '중간' : '낮음'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleStartGame}
          disabled={state.players.length < 3}
          className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg whitespace-nowrap cursor-pointer"
        >
          게임 시작
        </button>
        {state.history.length > 0 && (
          <button
            onClick={() => dispatch({ type: 'VIEW_HISTORY' })}
            className="px-4 sm:px-6 py-3 sm:py-4 bg-white text-purple-600 border-2 border-purple-600 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-purple-50 transition-all whitespace-nowrap cursor-pointer"
          >
            기록 보기
          </button>
        )}
      </div>
    </div>
  );
}
