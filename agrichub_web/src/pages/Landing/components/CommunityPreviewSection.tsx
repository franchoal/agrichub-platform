import {
  ArrowRight,
  BellRing,
  BriefcaseBusiness,
  MessageCircle,
  Sprout,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const communityFeatures = [
  {
    icon: Sprout,
    label: "Farmer Updates",
    title: "Share what is happening on your farm.",
    description:
      "Share experiences, progress, challenges and useful updates with people who understand agriculture.",
  },
  {
    icon: MessageCircle,
    label: "Questions & Discussions",
    title: "Ask. Learn. Exchange ideas.",
    description:
      "Start conversations, ask questions and learn from different perspectives across the agricultural community.",
  },
  {
    icon: BellRing,
    label: "Tips & Knowledge",
    title: "Useful information, when it matters.",
    description:
      "Discover practical tips, agricultural insights and knowledge shared within the community.",
  },
  {
    icon: BriefcaseBusiness,
    label: "Opportunities",
    title: "Keep an eye on what is happening.",
    description:
      "Discover useful agricultural opportunities and information as the AgricWise ecosystem continues to grow.",
  },
];

function CommunityPreviewSection() {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-14 sm:px-6 sm:py-18 lg:px-12 lg:py-24">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-72 w-72 rounded-full bg-green-100/60 blur-3xl sm:h-80 sm:w-80" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-lime-100/50 blur-3xl sm:h-96 sm:w-96" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-green-700 sm:px-4 sm:text-xs sm:tracking-[0.18em]">
              <Users size={14} />
              AgricWise Community
            </div>

            <h2 className="mt-4 text-[2rem] font-black leading-[1.08] tracking-tight text-gray-900 sm:mt-5 sm:text-4xl lg:text-5xl">
              Agriculture works{" "}
              <span className="text-green-600">
                better together.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600 sm:mt-5 sm:text-lg sm:leading-8">
              A place to share experiences, ask questions, exchange
              knowledge and discover useful conversations across
              agriculture.
            </p>
          </div>

          <Link
            to="/register"
            className="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-green-200 bg-white px-5 py-3 text-sm font-bold text-green-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-green-300 hover:bg-green-50 sm:w-fit"
          >
            Join the conversation

            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Community cards */}
        <div className="mt-9 grid grid-cols-1 gap-3 sm:mt-11 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {communityFeatures.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.label}
                className="group relative flex min-h-[255px] flex-col overflow-hidden rounded-[24px] border border-gray-100 bg-[#F7FAF5] p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:min-h-[285px] sm:rounded-[26px] sm:p-6"
              >
                {/* Card number */}
                <div className="absolute right-5 top-5 text-[10px] font-black tracking-[0.15em] text-green-200">
                  0{index + 1}
                </div>

                {/* Icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm ring-1 ring-green-100 transition duration-300 group-hover:bg-green-700 group-hover:text-white sm:h-12 sm:w-12 sm:rounded-2xl">
                  <Icon size={21} />
                </div>

                {/* Label */}
                <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.16em] text-green-600 sm:mt-6 sm:text-[10px]">
                  {feature.label}
                </p>

                {/* Title */}
                <h3 className="mt-2.5 text-lg font-extrabold leading-tight text-gray-900 sm:mt-3 sm:text-xl">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-2.5 text-sm leading-6 text-gray-600">
                  {feature.description}
                </p>

                {/* Bottom visual */}
                <div className="mt-auto pt-6">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500 sm:h-2 sm:w-2" />

                    <span className="text-[10px] font-semibold text-gray-400 sm:text-[11px]">
                      Part of the AgricWise community
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Closing panel */}
        <div className="mt-7 overflow-hidden rounded-[26px] bg-green-800 px-5 py-6 text-white sm:mt-8 sm:rounded-[28px] sm:px-8 sm:py-8 lg:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10 sm:h-11 sm:w-11 sm:rounded-2xl">
                <Users size={19} />
              </div>

              <div>
                <h3 className="text-base font-extrabold sm:text-lg">
                  Your experience matters.
                </h3>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-green-100/80">
                  Whether you are growing, buying, selling, learning or
                  building an agricultural business, there is a place
                  for your voice in the conversation.
                </p>
              </div>
            </div>

            <Link
              to="/register"
              className="group inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-green-800 transition duration-200 hover:-translate-y-0.5 hover:bg-green-50 sm:w-fit sm:px-6"
            >
              Create your account

              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CommunityPreviewSection;
