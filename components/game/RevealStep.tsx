'use client';

import { useState } from 'react';
import { GameState, GameAction } from '@/lib/gameReducer';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function RevealStep({ state, dispatch }: Props) {
  const [revealed, setRevealed] = useState(false);

  const currentPlayer = state.players[state.revealIndex];
  const currentRole = state.roles.find(r => r.playerId === currentPlayer.id);

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleNext = () => {
    setRevealed(false);
    dispatch({ type: 'NEXT_REVEAL' });
  };

  if (!revealed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 max-w-md w-full text-center border border-gray-100">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
            <i className="ri-eye-off-line text-3xl sm:text-4xl text-purple-600"></i>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
            기기를 전달하세요
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-8">
            다음 플레이어: <span className="font-bold text-purple-600">{currentPlayer.name}</span>
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8">
            {state.revealIndex + 1} / {state.players.length}
          </p>
          <button
            onClick={handleReveal}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg whitespace-nowrap cursor-pointer"
          >
            역할 확인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 max-w-md w-full text-center border border-gray-100">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            {currentPlayer.name}님
          </h2>
          <div className={`inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-lg ${
            currentRole?.role === 'citizen' 
              ? 'bg-blue-100 text-blue-700'
              : currentRole?.role === 'liar'
              ? 'bg-red-100 text-red-700'
              : 'bg-orange-100 text-orange-700'
          }`}>
            {currentRole?.role === 'citizen' && '시민'}
            {currentRole?.role === 'liar' && '라이어'}
            {currentRole?.role === 'spy' && '스파이'}
          </div>
        </div>

        {currentRole?.role === 'citizen' && (
          <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm text-blue-600 mb-2">당신의 단어</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-700">{currentRole.word}</p>
          </div>
        )}

        {currentRole?.role === 'liar' && (
          <div className="bg-red-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <p className="text-sm sm:text-base md:text-lg text-red-600">
              당신은 단어를 모릅니다.<br />
              다른 사람들의 대화를 듣고<br />
              정체를 숨기세요!
            </p>
          </div>
        )}

        {currentRole?.role === 'spy' && (
          <div className="bg-orange-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm text-orange-600 mb-2">당신의 단어</p>
            <p className="text-2xl sm:text-3xl font-bold text-orange-700 mb-2 sm:mb-3">{currentRole.word}</p>
            <p className="text-xs sm:text-sm text-orange-600">
              시민들과 다른 단어입니다.<br />
              정체를 숨기세요!
            </p>
          </div>
        )}

        <button
          onClick={handleNext}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-800 text-white rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-gray-900 transition-all shadow-lg whitespace-nowrap cursor-pointer"
        >
          숨기기 & 다음 플레이어
        </button>
      </div>
    </div>
  );
}
