'use client';

import { GameState, GameAction } from '@/lib/gameReducer';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function HistoryStep({ state, dispatch }: Props) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
          <i className="ri-history-line text-purple-600 text-xl sm:text-2xl"></i>
          게임 기록
        </h2>

        {state.history.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <i className="ri-inbox-line text-4xl sm:text-6xl text-gray-300 mb-3 sm:mb-4"></i>
            <p className="text-sm sm:text-base text-gray-500">아직 게임 기록이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {state.history.map((record, index) => {
              const eliminatedPlayer = state.players.find(p => p.id === record.eliminatedId);
              const liarPlayer = state.players.find(p => p.id === record.liarId);
              const spyPlayer = state.players.find(p => p.id === record.spyId);

              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800">
                      라운드 {record.roundNo}
                    </h3>
                    <div className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full font-bold text-xs sm:text-sm ${
                      record.winner === 'citizen'
                        ? 'bg-blue-100 text-blue-700'
                        : record.winner === 'liar'
                        ? 'bg-red-100 text-red-700'
                        : record.winner === 'spy'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {record.winner === 'citizen' && '시민 승리'}
                      {record.winner === 'liar' && '라이어 승리'}
                      {record.winner === 'spy' && '스파이 승리'}
                      {record.winner === 'none' && '무승부'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="bg-white rounded-lg p-3 sm:p-4">
                      <p className="text-xs text-gray-500 mb-1">시민의 단어</p>
                      <p className="font-bold text-gray-800 text-sm sm:text-base">{record.mainWord}</p>
                    </div>
                    {record.spyWord && (
                      <div className="bg-white rounded-lg p-3 sm:p-4">
                        <p className="text-xs text-gray-500 mb-1">스파이의 단어</p>
                        <p className="font-bold text-gray-800 text-sm sm:text-base">{record.spyWord}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">제거된 플레이어:</span>
                      <span className="font-bold text-gray-800">{eliminatedPlayer?.name}</span>
                    </div>
                    {liarPlayer && (
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">라이어:</span>
                        <span className="font-bold text-red-600">{liarPlayer.name}</span>
                      </div>
                    )}
                    {spyPlayer && (
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">스파이:</span>
                        <span className="font-bold text-orange-600">{spyPlayer.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button
        onClick={() => dispatch({ type: 'BACK_TO_SETUP' })}
        className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg whitespace-nowrap cursor-pointer"
      >
        새 게임 시작
      </button>
    </div>
  );
}
