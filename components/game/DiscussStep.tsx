'use client';

import { useEffect } from 'react';
import { GameState, GameAction } from '@/lib/gameReducer';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function DiscussStep({ state, dispatch }: Props) {
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.timerStarted && !state.timerPaused) {
      interval = setInterval(() => {
        dispatch({ type: 'UPDATE_TIMER', elapsed: state.elapsedTime + 1 });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.timerStarted, state.timerPaused, state.elapsedTime, dispatch]);

  const remainingTime = Math.max(0, state.settings.durationSec - state.elapsedTime);
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const progress = (state.elapsedTime / state.settings.durationSec) * 100;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center justify-center gap-2">
          <i className="ri-chat-3-line text-purple-600 text-xl sm:text-2xl"></i>
          토론 시간
        </h2>

        <div className="mb-6 sm:mb-8">
          <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-3 sm:mb-4">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-1000"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center mb-4 sm:mb-6">
          {!state.timerStarted ? (
            <button
              onClick={() => dispatch({ type: 'START_TIMER' })}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer text-sm sm:text-base"
            >
              <i className="ri-play-fill text-lg sm:text-xl"></i>
              시작
            </button>
          ) : (
            <button
              onClick={() => dispatch({ type: 'PAUSE_TIMER' })}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer text-sm sm:text-base"
            >
              <i className={`${state.timerPaused ? 'ri-play-fill' : 'ri-pause-fill'} text-lg sm:text-xl`}></i>
              {state.timerPaused ? '재개' : '일시정지'}
            </button>
          )}
          <button
            onClick={() => dispatch({ type: 'RESET_TIMER' })}
            className="px-6 sm:px-8 py-2 sm:py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer text-sm sm:text-base"
          >
            <i className="ri-restart-line text-lg sm:text-xl"></i>
            리셋
          </button>
        </div>

        {!state.settings.hideWordDuringDiscuss && state.round && (
          <div className="bg-purple-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-purple-600 mb-2">시민의 단어</p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-700">{state.round.mainWord}</p>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="font-bold text-blue-800 mb-2 sm:mb-3 flex items-center justify-center gap-2 text-sm sm:text-base">
            <i className="ri-lightbulb-line"></i>
            토론 가이드
          </h3>
          <ul className="text-xs sm:text-sm text-blue-700 space-y-1 sm:space-y-2 text-left">
            <li>• 돌아가며 단어에 대한 힌트를 말하세요</li>
            <li>• 너무 직접적인 힌트는 피하세요</li>
            <li>• 다른 사람의 반응을 주의깊게 관찰하세요</li>
            <li>• 의심스러운 사람에게 질문하세요</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg">
          <i className="ri-team-line text-purple-600"></i>
          참가자 ({state.players.length}명)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
          {state.players.map((player) => (
            <div
              key={player.id}
              className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg text-center font-medium text-gray-700 text-sm sm:text-base"
            >
              {player.name}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => dispatch({ type: 'START_VOTE' })}
        className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg whitespace-nowrap cursor-pointer"
      >
        투표 시작
      </button>
    </div>
  );
}
