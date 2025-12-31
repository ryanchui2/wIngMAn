'use client';

import { useRouter } from 'next/navigation';

interface WelcomeScreenProps {
  onGuestContinue: () => void;
}

export default function WelcomeScreen({ onGuestContinue }: WelcomeScreenProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#e2c0d7] to-white z-50 flex items-center justify-center px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Logo/Title */}
        <h1 className="text-6xl md:text-7xl font-black text-center text-black tracking-tighter mb-12">
          WINGMAN
        </h1>

        {/* Welcome Message */}
        <div className="bg-white border-4 border-black p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center font-mono uppercase">
            Welcome
          </h2>

          <p className="text-center text-gray-600">
            Choose how you'd like to continue
          </p>

          {/* Login Button */}
          <button
            onClick={() => router.push('/login')}
            className="w-full px-6 py-4 bg-black text-white border-4 border-black hover:bg-white hover:text-black transition-colors font-mono font-bold uppercase tracking-wider"
          >
            Sign In with Google
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 font-mono">
                OR
              </span>
            </div>
          </div>

          {/* Guest Button */}
          <button
            onClick={onGuestContinue}
            className="w-full px-6 py-4 bg-gray-100 border-4 border-black hover:bg-gray-200 transition-colors font-mono font-bold uppercase tracking-wider"
          >
            Continue as Guest (5 messages)
          </button>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-gray-600 font-mono">
          Guests get 5 free messages. Sign in to save history and get unlimited access.
        </p>
      </div>
    </div>
  );
}
