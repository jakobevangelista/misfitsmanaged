const features = [
  {
    name: "Strength Redefined",
    description:
      "At Corrupted Strength, we go beyond conventional fitness. We're a community dedicated to pushing boundaries, helping you unlock your full potential in the world of powerlifting.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-dumbbell"
      >
        <path d="m6.5 6.5 11 11" />
        <path d="m21 21-1-1" />
        <path d="m3 3 1 1" />
        <path d="m18 22 4-4" />
        <path d="m2 6 4-4" />
        <path d="m3 10 7-7" />
        <path d="m14 21 7-7" />
      </svg>
    ),
  },
  {
    name: "State-of-the-art Equipment",
    description:
      "Train with confidence using our top-of-the-line powerlifting gear. From competition-grade barbells to premium racks, we provide the best tools for peak performance and safety.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-zap"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    name: "Flexible Membership Options",
    description:
      "Choose the membership that suits your fitness journey. Our options, from unlimited access to personalized packages, offer flexibility, empowering you to achieve your goals.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-trophy"
      >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
  },
  {
    name: "Compete or just improve",
    description:
      "Corrupted Strength welcomes competitive athletes and those focused on self-improvement. Our community support your journey, whether you aim for the podium or personal growth. Join us to compete or improve; the choice is yours.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-weight"
      >
        <circle cx="12" cy="5" r="3" />
        <path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z" />
      </svg>
    ),
  },
];

const FeatureSection = () => {
  return (
    <>
      <div className=" py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-[#EA0607]">
              Become Stronger
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[#efe1b2] sm:text-4xl">
              Get Better Today at Corrupted Strength
            </p>
            <p className="mt-6 text-lg leading-8 text-[#efe1b2]/80">
              Unleash the relentless strength within you and achieve greatness
              in the world of powerlifting. Our world-class ecosystem,
              cutting-edge equipment, and unwavering support are your keys to
              redefining what's possible.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-[#efe1b2]">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#EA0607]">
                      {/* <feature.icon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      /> */}
                      {feature.icon}
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-[#efe1b2]/80">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeatureSection;
