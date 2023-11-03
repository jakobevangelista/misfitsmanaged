const faqs = [
  {
    question: "What are your hours?",
    answer: (
      <ul className="flex flex-col">
        <li>Monday-Thursday: 7am-11pm</li>
        <li>Friday: 8am-9pm</li>
        <li>Saturday: 8am-8pm</li>
        <li>Sunday: 10am-5pm</li>
      </ul>
    ),
  },
  {
    question: "Where are you located?",
    answer: (
      <div>
        803 Summer Park Dr. Suite 150, Stafford, TX 77477
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13875.568944181003!2d-95.5686459!3d29.6068188!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640e70d80e7d075%3A0x56bfac1bc0e5b292!2sCorrupted%20Strength!5e0!3m2!1sen!2sus!4v1699040748550!5m2!1sen!2sus"
          width="550"
          height="400"
          className="border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    ),
  },

  {
    question: "Can I film at your gym?",
    answer: (
      <div>
        Vlogging and personal photograph is allowed, but any additional
        equipment that is being used to film must be approved by management.
        Please contact gianella@corruptedstrengthgym.com for more information.
      </div>
    ),
  },
  // More questions...
];

export default function FAQ() {
  return (
    <div id="about">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:pt-32 lg:px-8 lg:py-40">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 className="text-2xl font-bold leading-10 tracking-tight text-[#efe1b2]">
              About Us
            </h2>
            <p className="mt-4 text-base leading-7 text-[#efe1b2]/80">
              Can’t find the answer you’re looking for? Reach out to our{" "}
              <a
                href="#contact"
                className="font-semibold text-[#EA0607] hover:text-[#EA0607]/90"
              >
                customer support
              </a>{" "}
              team.
            </p>
          </div>
          <div className="mt-10 lg:col-span-7 lg:mt-0">
            <dl className="space-y-10">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="text-base font-semibold leading-7 text-[#efe1b2]">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-[#efe1b2]/90">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
