'use client';

import { useState } from 'react';
import { GameState, GameAction } from '@/lib/gameReducer';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function VoteStep({ state, dispatch }: Props) {
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [showTransfer, setShowTransfer] = useState(false);

  const currentVoter = state.players[currentVoterIndex];
  const hasVoted = state.votes.some(v => v.voterId === currentVoter.id);

  const availableTargets = state.settings.allowSelfVote
    ? state.players
    : state.players.filter(p => p.id !== currentVoter.id);

  const handleVote = () => {
    if (!selectedTarget) return;

    dispatch({ type: 'CAST_VOTE', voterId: currentVoter.id, targetId: selectedTarget });
    setSelectedTarget(null);
    
    if (currentVoterIndex < state.players.length - 1) {
      setShowTransfer(true);
    } else {
      dispatch({ type: 'SHOW_RESULT' });
    }
  };

  const handleNextVoter = () => {
    setShowTransfer(false);
    setCurrentVoterIndex(currentVoterIndex + 1);
  };

  if (showTransfer) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 max-w-md w-full text-center border border-gray-100">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
            <i className="ri-arrow-right-line text-3xl sm:text-4xl text-purple-600"></i>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
            기기를 전달하세요
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-8">
            다음 투표자: <span className="font-bold text-purple-600">{state.players[currentVoterIndex + 1].name}</span>
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8">
            {currentVoterIndex + 1} / {state.players.length}
          </p>
          <button
            onClick={handleNextVoter}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg whitespace-nowrap cursor-pointer"
          >
            다음 투표자
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <i className="ri-checkbox-circle-line text-purple-600 text-xl sm:text-2xl"></i>
            비밀 투표
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            현재 투표자: <span className="font-bold text-purple-600">{currentVoter.name}</span>
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            {currentVoterIndex + 1} / {state.players.length}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 text-center">
          <p className="text-xs sm:text-sm text-purple-600 mb-2">의심스러운 사람을 선택하세요</p>
          <p className="text-base sm:text-lg font-bold text-purple-700">
            {state.settings.mode === 'liar' && '라이어를 찾아내세요!'}
            {state.settings.mode === 'spy' && '스파이를 찾아내세요!'}
            {state.settings.mode === 'hybrid' && '라이어 또는 스파이를 찾아내세요!'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
          {availableTargets.map((player) => (
            <button
              key={player.id}
              onClick={() => setSelectedTarget(player.id)}
              className={`px-3 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedTarget === player.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {player.name}
            </button>
          ))}
        </div>

        <button
          onClick={handleVote}
          disabled={!selectedTarget}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg whitespace-nowrap cursor-pointer"
        >
          투표하기
        </button>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg">
          <i className="ri-information-line text-purple-600"></i>
          투표 진행 상황
        </h3>
        <div className="space-y-2">
          {state.players.map((player, index) => {
            const voted = state.votes.some(v => v.voterId === player.id);
            return (
              <div
                key={player.id}
                className={`flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 rounded-lg ${
                  index === currentVoterIndex
                    ? 'bg-purple-100 border-2 border-purple-600'
                    : voted
                    ? 'bg-green-50'
                    : 'bg-gray-50'
                }`}
              >
                <span className="font-medium text-gray-700 text-sm sm:text-base">{player.name}</span>
                {voted && (
                  <i className="ri-check-line text-green-600 text-lg sm:text-xl"></i>
                )}
                {index === currentVoterIndex && !voted && (
                  <span className="text-xs sm:text-sm text-purple-600 font-medium">투표 중</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
