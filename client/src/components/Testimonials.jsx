import React from "react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Donald Jackman",
      role: "Graphic Designer",
      img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      review:
        "I've been using AiVerse for my design workflow — it's intuitive, fast, and makes content creation effortless.",
    },
    {
      name: "Richard Nelson",
      role: "Content Creator",
      img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      review:
        "AiVerse has transformed how I generate blogs and visuals. It saves hours every week!",
    },
    {
      name: "James Washington",
      role: "Co-founder",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
      review:
        "An all-in-one AI assistant for modern creators. I recommend it to anyone working in digital content.",
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-10 left-0 w-72 h-72 bg-[#4A7AFF]/10 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-0 w-72 h-72 bg-[#b617f4]/10 blur-3xl rounded-full animate-pulse"></div>

      {/* Section Heading */}
      <div className="relative text-center mb-16 z-10">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
          Loved by{" "}
          <span className="bg-gradient-to-r from-[#4A7AFF] to-[#b617f4] bg-clip-text text-transparent">
            Creators
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Don’t just take our word for it — see what our users are saying about{" "}
          <span className="font-semibold text-[#4A7AFF]">AiVerse</span>.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="relative flex items-center justify-center flex-wrap gap-8 px-6 z-10">
        {testimonials.map((user, i) => (
          <div
            key={i}
            className="w-80 bg-white/70 backdrop-blur-lg border border-gray-100 rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"
          >
            {/* Gradient glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-[#4A7AFF]/20 to-[#b617f4]/20 blur-lg transition-opacity duration-500"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-4">
                <img
                  className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md"
                  src={user.img}
                  alt={user.name}
                />
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                {user.name}
              </h3>
              <p className="text-sm text-gray-500">{user.role}</p>

              {/* ⭐ Stars */}
              <div className="flex items-center justify-center mt-3 gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    width="16"
                    height="15"
                    viewBox="0 0 16 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-yellow-400"
                  >
                    <path
                      d="M7.524.464a.5.5 0 0 1 .952 0l1.432 4.41a.5.5 0 0 0 .476.345h4.637a.5.5 0 0 1 .294.904L11.563 8.85a.5.5 0 0 0-.181.559l1.433 4.41a.5.5 0 0 1-.77.559L8.294 11.65a.5.5 0 0 0-.588 0l-3.751 2.726a.5.5 0 0 1-.77-.56l1.433-4.41a.5.5 0 0 0-.181-.558L.685 6.123A.5.5 0 0 1 .98 5.22h4.637a.5.5 0 0 0 .476-.346z"
                      fill="#FFD700"
                    />
                  </svg>
                ))}
              </div>

              <p className="text-center text-[15px] mt-4 text-gray-600 leading-relaxed italic">
                “{user.review}”
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
