'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="text-center mb-12 sm:mb-16">
          <Link href="/" className="inline-flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 hover:opacity-80 transition-opacity cursor-pointer">
            <img 
              src="https://static.readdy.ai/image/aa1565715a7c63aa7d986d857e515b00/6239eec17bd0885da47b8a2380a2f955.png" 
              alt="Logo" 
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain"
            />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              라이어 게임
            </h1>
          </Link>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 px-4">
            친구들과 함께 즐기는 추리 파티 게임
          </p>
          <Link href="/game">
            <button className="px-8 sm:px-10 md:px-12 py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-2xl hover:scale-105 whitespace-nowrap cursor-pointer">
              게임 시작하기
            </button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 text-center hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <i className="ri-spy-line text-2xl sm:text-3xl text-red-600"></i>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">라이어 모드</h3>
            <p className="text-sm sm:text-base text-gray-600">
              한 명의 라이어가 단어를 모릅니다. 라이어를 찾아내세요!
            </p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 text-center hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <i className="ri-user-search-line text-2xl sm:text-3xl text-orange-600"></i>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">스파이 모드</h3>
            <p className="text-sm sm:text-base text-gray-600">
              스파이는 다른 단어를 받습니다. 정체를 숨기고 살아남으세요!
            </p>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 text-center hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="ri-team-line text-2xl sm:text-3xl text-purple-600"></i>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">하이브리드 모드</h3>
            <p className="text-sm sm:text-base text-gray-600">
              라이어와 스파이가 동시에! 더욱 복잡한 추리 게임을 즐기세요.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">게임 방법</h2>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-purple-600 text-white rounded-full font-bold flex-shrink-0 text-sm sm:text-base">
                1
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1 sm:mb-2 text-base sm:text-lg">플레이어 설정</h4>
                <p className="text-sm sm:text-base text-gray-600">최소 3명의 플레이어를 추가하고 게임 모드와 카테고리를 선택하세요.</p>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-purple-600 text-white rounded-full font-bold flex-shrink-0 text-sm sm:text-base">
                2
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1 sm:mb-2 text-base sm:text-lg">역할 확인</h4>
                <p className="text-sm sm:text-base text-gray-600">기기를 돌려가며 각자의 역할과 단어를 확인하세요. 다른 사람에게 보이지 않게 주의!</p>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-purple-600 text-white rounded-full font-bold flex-shrink-0 text-sm sm:text-base">
                3
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1 sm:mb-2 text-base sm:text-lg">토론 시간</h4>
                <p className="text-sm sm:text-base text-gray-600">돌아가며 단어에 대한 힌트를 말하고, 의심스러운 사람을 찾아내세요.</p>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-purple-600 text-white rounded-full font-bold flex-shrink-0 text-sm sm:text-base">
                4
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1 sm:mb-2 text-base sm:text-lg">투표 & 결과</h4>
                <p className="text-sm sm:text-base text-gray-600">의심스러운 사람에게 투표하고, 라이어나 스파이를 찾아내면 승리!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 text-center text-white">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">지금 바로 시작하세요!</h2>
          <p className="text-base sm:text-lg mb-4 sm:mb-6 opacity-90">
            친구들과 함께 즐거운 추리 게임을 경험해보세요
          </p>
          <Link href="/game">
            <button className="px-8 sm:px-10 py-3 sm:py-4 bg-white text-purple-600 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-gray-100 transition-all shadow-lg whitespace-nowrap cursor-pointer">
              게임 시작하기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
