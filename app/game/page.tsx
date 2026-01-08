'use client';

import { useReducer } from 'react';
import Link from 'next/link';
import { gameReducer, initialState } from '@/lib/gameReducer';
import SetupStep from '@/components/game/SetupStep';
import RevealStep from '@/components/game/RevealStep';
import DiscussStep from '@/components/game/DiscussStep';
import VoteStep from '@/components/game/VoteStep';
import ResultStep from '@/components/game/ResultStep';
import HistoryStep from '@/components/game/HistoryStep';

export default function GamePage() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0">
            <img 
              src="https://static.readdy.ai/image/aa1565715a7c63aa7d986d857e515b00/6239eec17bd0885da47b8a2380a2f955.png" 
              alt="Logo" 
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
            />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap">
              라이어 게임
            </h1>
          </Link>
          {state.step !== 'setup' && (
            <button
              onClick={() => dispatch({ type: 'BACK_TO_SETUP' })}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer flex-shrink-0"
            >
              처음으로
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {state.step === 'setup' && <SetupStep state={state} dispatch={dispatch} />}
        {state.step === 'reveal' && <RevealStep state={state} dispatch={dispatch} />}
        {state.step === 'discuss' && <DiscussStep state={state} dispatch={dispatch} />}
        {state.step === 'vote' && <VoteStep state={state} dispatch={dispatch} />}
        {state.step === 'result' && <ResultStep state={state} dispatch={dispatch} />}
        {state.step === 'history' && <HistoryStep state={state} dispatch={dispatch} />}
      </main>
    </div>
  );
}
