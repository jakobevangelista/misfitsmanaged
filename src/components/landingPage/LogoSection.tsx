import Image from "next/image";

const LogoSection = () => {
  return (
    <>
      <div className=" py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-lg font-semibold leading-8 text-white">
            Trusted by the world&apos;s strongest brands
          </h2>
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            <Image
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
              src="https://i0.wp.com/ghoststrong.com/wp-content/uploads/2020/08/Ghost-Strong-White-Logo-Lg.png?fit=3410%2C1620&ssl=1"
              alt="Ghost Strong"
              width={158}
              height={48}
            />
            <Image
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
              src="https://assets.roguefitness.com/image/upload/v1610106897/media/rogue-og.jpg"
              alt="Rogue Fitness"
              width={158}
              height={48}
            />
            <Image
              className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
              src="https://cdn.shopify.com/s/files/1/1741/9585/files/BetterBrandLogo.png?v=1682038531"
              alt="Better"
              width={158}
              height={48}
            />
            <Image
              className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
              src="https://m.media-amazon.com/images/S/stores-image-uploads-na-prod/3/AmazonStores/ATVPDKIKX0DER/12914a701e223f2e367248ffc54be23e.w2400.h2400.jpg"
              alt="SavvyCal"
              width={158}
              height={48}
            />
            <Image
              className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
              src="https://static1.squarespace.com/static/564fc518e4b0b746f0db7674/t/5bed2215c2241be8398e7d2d/1696834157532/"
              alt="Flexx Training Systems"
              width={158}
              height={48}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoSection;
