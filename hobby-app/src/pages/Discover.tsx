import Navbar from "@/components/Navbar";
import bg from "./discoverBckgrd.png";
import { useState, useEffect } from "react";
import MatchConfirm from "../components/MatchConfirm";
import TriviaBox from "@/components/TriviaBox";
import { mockProfiles, UserProfile } from "@/mock/mockProfiles";
import { triviaQuestions } from "@/mock/triviaQuestions";

const DiscoverPage = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [inTrivia, setInTrivia] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setProfiles(mockProfiles);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const currentProfile = profiles[currentProfileIndex];

  const handleConfirm = () => {
    setInTrivia(true);
    setQuestionIndex(0);
    setScore(0);
  };

  const handleCancel = () => {
    setCurrentProfileIndex((prev) => (prev + 1) % mockProfiles.length);
  };

  const addMatchToSession = (profile: UserProfile) => {
    const stored = sessionStorage.getItem("matches");
    const existing = stored ? JSON.parse(stored) : [];
    const updated = [
      ...existing.filter((p: UserProfile) => p.id !== profile.id),
      profile,
    ];
    sessionStorage.setItem("matches", JSON.stringify(updated));
  };

  const handleTriviaAnswer = (isCorrect: boolean) => {
    const newScore = Math.max(0, isCorrect ? score + 1 : score - 1);
    setScore(newScore);

    if (questionIndex < triviaQuestions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      if (newScore >= 5 && currentProfile) {
        addMatchToSession(currentProfile);
      }
      moveToNextProfile();
    }
  };

  const moveToNextProfile = () => {
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex((prev) => prev + 1);
    } else {
      setProfiles([]);
    }
    setInTrivia(false);
    setScore(0);
    setQuestionIndex(0);
  };

  const renderMatchMeter = () => (
    <div className="flex justify-center mb-4">
      <div className="relative flex flex-col-reverse h-64 w-8 border-4 border-game-black bg-white shadow-[4px_4px_0_#000] p-1 gap-[2px]">
        {[...Array(10)].map((_, i) => {
          let colorClass = "bg-gray-200";

          if (i < score) {
            if (score >= 5) {
              colorClass = "bg-game-green";
            } else if (score === 4) {
              colorClass = "bg-game-yellow";
            } else {
              colorClass = "bg-game-red";
            }
          }

          return (
            <div
              key={i}
              className={`flex-1 w-full ${colorClass} transition-all duration-300`}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full">
      <div
        className="fixed inset-0 bg-contain bg-center bg-no-repeat overflow-hidden -z-10"
        style={{
          backgroundImage: `url(${bg})`,
          imageRendering: "pixelated",
        }}
      />

      <main>
        {inTrivia && currentProfile ? (
          <div className="flex justify-center items-start gap-4 mt-6">
            <TriviaBox
              question={triviaQuestions[questionIndex]}
              onAnswerSubmit={handleTriviaAnswer}
            />
            {renderMatchMeter()}
          </div>
        ) : currentProfile ? (
          <>
            <div className="absolute top-4 left-4 bg-game-white border-4 border-black px-4 py-3 shadow-[4px_4px_0_#333333]">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{currentProfile.name},</h2>
                <span className="text-lg font-bold">{currentProfile.age}</span>
                <span className="text-sm">{currentProfile.location}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {currentProfile.hobbies.map((hobby) => (
                  <span
                    key={hobby}
                    className="px-2 py-1 text-sm font-semibold text-white border-2 border-black shadow bg-gray-600"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>

            <img
              src={currentProfile.avatar}
              alt={currentProfile.name}
              className="absolute top-36 right-20 w-16 h-16"
            />

            <img
              src="https://archives.bulbagarden.net/media/upload/9/9a/Spr_RS_May.png"
              alt="You"
              className="absolute bottom-32 left-20 w-20 h-20"
            />

            <div className="absolute bottom-44 right-16 bg-game-white border-4 border-black px-4 py-2 shadow-[4px_4px_0_#333333]">
              <span className="font-bold text-lg">Bob, 24</span>
            </div>

            <div className="absolute insert-x-0 bottom-[130px] left-1/2 -translate-x-1/2">
              <MatchConfirm onConfirm={handleConfirm} onCancel={handleCancel} />
            </div>
          </>
        ) : (
          <div className="text-center mt-20 font-pixel text-xl text-game-black">
            No more profiles!
          </div>
        )}
      </main>

      <Navbar />
    </div>
  );
};

export default DiscoverPage;
