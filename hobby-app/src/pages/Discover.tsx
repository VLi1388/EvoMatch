import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import MatchConfirm from "../components/MatchConfirm";
import { mockProfiles, UserProfile } from "@/mock/mockProfiles";
import bg from "./discoverBckgrd.png";
import HobbyBadge from "@/components/HobbyBadge";
import TriviaBox from "@/components/TriviaBox";
import { triviaQuestions } from "@/mock/triviaQuestions";

const DiscoverPage = () => {
  const [opponentIndex, setOpponentIndex] = useState(0);
  const opponent = mockProfiles[opponentIndex];
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
    setOpponentIndex((prev) => (prev + 1) % mockProfiles.length);
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
      {/* Background image */}
      <div
        className="fixed inset-0 bg-contain bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: `url(${bg})`,
          imageRendering: "pixelated",
          overflow: "hidden",
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
            {/* Opponent Speech Bubble */}
            <div className="fixed max-w-sm top-4 left-[450px] z-10">
              {/* Speech Bubble Box */}
              <div
                className="bg-game-white text-black p-4 "
                style={{
                  boxShadow: "4px 4px 0 #333",
                }}
              >
                {/* Avatar */}
                {opponent.avatar && (
                  <img
                    src={opponent.avatar}
                    alt={`${opponent.name}'s avatar`}
                    className="w-12 h-12 rounded mb-2 border-[2px] border-black"
                  />
                )}

                {/* Name and Age */}
                <p className="font-pixel mb-1">
                  {opponent.name}, {opponent.age}
                </p>

                {/* Hobby badges */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {opponent.hobbies.map((hobby) => (
                    <HobbyBadge key={hobby} hobby={hobby} readOnly />
                  ))}
                </div>
              </div>

              {/* Tail triangle on bottom-right */}
              <div
                className="absolute -bottom-2 right-4 w-0 h-0"
                style={{
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderTop: "10px solid #DDEEEB", // matches bubble color
                  filter: "drop-shadow(4px 4px 0 #333)",
                }}
              />
            </div>

            <div className="fixed bottom-[260px] right-[360px]">
              {/* Figurine */}
              {opponent.figurine && (
                <img
                  src={opponent.figurine}
                  alt={`${opponent.name}'s figurine`}
                  className="w-96 h-96"
                />
              )}
            </div>

            {/* User Speech Bubble */}
            <div className="fixed max-w-sm bottom-[240px] right-[450px]">
              {/* Speech Bubble Box */}
              <div
                className="bg-game-white text-black p-4 "
                style={{
                  boxShadow: "4px 4px 0 #333",
                }}
              >
                {/* Name and Age */}
                <p className="font-pixel mb-1">Victoria, 24</p>
              </div>

              {/* Tail triangle on bottom-right */}
              <div
                className="absolute -bottom-2 left-4 w-0 h-0"
                style={{
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderTop: "10px solid #DDEEEB", // matches bubble color
                  filter: "drop-shadow(4px 4px 0 #333)",
                }}
              />
            </div>

            {/* User figurine */}
            <div className="fixed bottom-[40px] left-[240px] p-4">
              <img
                src="https://play.pokemonshowdown.com/sprites/ani-back/pikachu.gif"
                alt="Pikachu back sprite"
                className="w-96 h-96"
              />
            </div>

            {/* Match Confirmation Box */}
            <div className="fixed bottom-[100px] left-1/2 -translate-x-1/2">
              <MatchConfirm onConfirm={handleConfirm} onCancel={handleCancel} />
            </div>
          </>
        ) : (
          <div className="text-center mt-20 font-pixel text-xl text-game-black">
            No more profiles!
          </div>
        )}
      </main>

      {!inTrivia && <Navbar />}
    </div>
  );
};

export default DiscoverPage;
