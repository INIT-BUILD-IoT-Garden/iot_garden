import { Footer } from "@/components/Footer";
import { GardenBackground } from "@/components/GardenBackground";
import { NavBar } from "@/components/NavBar";
import { TeamBook } from "@/components/TeamBook";
import { teamMembers } from "@/data/teamMembers";
import { Suspense, useEffect } from "react";

export function AboutUs() {
  // Set active section to "about" when component mounts
  useEffect(() => {
    console.log("TeamMembers data:", teamMembers);
    console.log(
      "TeamMembers structure:",
      JSON.stringify(teamMembers[0], null, 2),
    );
  }, []);

  return (
    <main className="relative h-screen w-full snap-y snap-mandatory overflow-x-hidden overflow-y-scroll">
      <NavBar isAboutPage />
      <div className="relative">
        <div className="fixed inset-0 grid grid-cols-1 md:grid-cols-5">
          <div className="hidden md:block" />
          <div className="col-span-1 md:col-span-4" />
        </div>

        {/* Background */}
        <div className="sticky top-0 h-screen w-full">
          <GardenBackground />
        </div>

        {/* Content */}
        <section className="scroll-section relative z-10 min-h-screen">
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Left column - empty for nav */}
            <div className="hidden md:block" />
            {/* Main content  4 column */}
            <div className="col-span-1 px-10 py-32 md:col-span-4">
              <div className="rounded-xl border border-black/30 bg-transparent backdrop-blur-sm">
                <Suspense fallback={<div>Loading...</div>}>
                  <TeamBook members={teamMembers} />
                </Suspense>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Footer Section */}
      <section className="scroll-section">
        <Footer />
      </section>
    </main>
  );
}
