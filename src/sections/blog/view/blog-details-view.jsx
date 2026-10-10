"use client";

import { RouterLink } from "@/routes/components";
import { paths } from "@/routes/paths";
import { fDate } from "@/utils/format-time";
import { Markdown } from "@/components/markdown";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { EmptyContent } from "@/components/empty-content";
import { Iconify } from "@/components/iconify";
import { BlogDetailsSkeleton } from "../blog-skeleton";
import { useGetBlogDetail, useGetBlogs } from "@/api";

// ----------------------------------------------------------------------

// Recent Blog Card Component
function RecentBlogCard({ blog }) {
  const { title, featured_image, created_at, slug } = blog;

  return (
    <RouterLink
      href={paths.blog.details(slug)}
      className="group flex gap-4 p-3 no-underline bg-white dark:bg-gray-900 border border-gray-500/12 rounded-2xl transition-all duration-300 hover:border-primary-main hover:shadow-[0_4px_20px_rgba(var(--primary-main-channel),0.15)]"
    >
      <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden">
        <img
          src={featured_image}
          alt={title}
          title={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-[1.4] line-clamp-2">
          {title}
        </p>

        <div className="flex items-center gap-1">
          <Iconify icon="solar:calendar-linear" width={14} className="text-gray-400" />
          <span className="text-xs text-gray-500">{fDate(created_at)}</span>
        </div>
      </div>
    </RouterLink>
  );
}

// Share Buttons Component
function ShareButtons({ title }) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareLinks = [
    {
      name: "Facebook",
      icon: "mdi:facebook",
      color: "#1877F2",
      bgColor: "rgba(24,119,242,0.1)",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Twitter",
      icon: "mdi:twitter",
      color: "#1DA1F2",
      bgColor: "rgba(29,161,242,0.1)",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: "LinkedIn",
      icon: "mdi:linkedin",
      color: "#0A66C2",
      bgColor: "rgba(10,102,194,0.1)",
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`,
    },
    {
      name: "WhatsApp",
      icon: "mdi:whatsapp",
      color: "#25D366",
      bgColor: "rgba(37,211,102,0.1)",
      url: `https://wa.me/?text=${encodeURIComponent(`${title} - ${shareUrl}`)}`,
    },
  ];

  return (
    <div className="flex gap-2">
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200"
          style={{ backgroundColor: link.bgColor, color: link.color }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = link.color;
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = link.bgColor;
            e.currentTarget.style.color = link.color;
          }}
        >
          <Iconify icon={link.icon} width={18} />
        </a>
      ))}
    </div>
  );
}

// Sidebar Skeleton
function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="flex gap-4">
          <div className="w-20 h-20 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-4 w-3/5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BlogDetailsView({ slug }) {
  const { blog, isLoading, error } = useGetBlogDetail(slug);
  const { blogs: allBlogs, isLoading: blogsLoading } = useGetBlogs();

  const { title, description, featured_image, created_by, created_at, category } =
    blog || {};

  const recentBlogs = allBlogs.filter((b) => b.slug !== slug).slice(0, 5);

  const isBlogFound = !isLoading && !error && title;
  const isBlogMissing = !isLoading && (error || !title);

  // const readingTime = description
  //   ? Math.ceil(description.replace(/<[^>]*>/g, "").split(/\s+/).length / 200)
  //   : 3;

  const renderLoading = () => <BlogDetailsSkeleton />;

  const renderError = () => (
    <EmptyContent
      title="Blog Not Found"
      description="Oops! The blog you're looking for isn't available."
      action={
        <RouterLink
          href={paths.blog.root}
          className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary border border-gray-300 hover:border-primary transition-colors"
        >
          <Iconify icon="eva:arrow-ios-back-fill" width={16} />
          Back to List
        </RouterLink>
      }
      className="py-20"
    />
  );

  const renderBlog = () => (
    <>
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 to-black/70" />

        <img
          src={featured_image}
          alt={title}
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-0 left-0 right-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
          <div className="flex flex-col gap-6 max-w-[800px]">
            {/* Category Badge */}
            {category && (
              <span className="self-start bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                {category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-white font-extrabold text-[1.75rem] md:text-[2.5rem] leading-[1.3]">
              {title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {created_by?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <span className="text-white font-semibold text-sm">
                  {created_by || "Admin"}
                </span>
              </div>

              {/* Dot separator */}
              <span className="hidden sm:block w-1 h-1 rounded-full bg-gray-400" />

              {/* Date */}
              <div className="flex items-center gap-2">
                <Iconify icon="solar:calendar-bold" width={18} className="text-gray-400" />
                <span className="text-gray-300 text-sm">{fDate(created_at)}</span>
              </div>

              {/* Dot separator */}
              <span className="hidden sm:block w-1 h-1 rounded-full bg-gray-400" />

              {/* Reading time */}
              {/* <div className="flex items-center gap-2">
                <Iconify icon="solar:clock-circle-bold" width={18} className="text-gray-400" />
                <span className="text-gray-300 text-sm">{readingTime} min read</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <CustomBreadcrumbs
          links={[
            { name: "Home", href: paths.home },
            { name: "Blog", href: paths.blog.root },
            { name: title },
          ]}
          className="py-6"
        />
      </div>

      {/* Main Content + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

          {/* Main Content */}
          <div className="md:col-span-8">
            <div className="p-3 md:p-3 rounded-3xl bg-white  border border-gray-500/12">
              {/* Article Body */}
              <div
                className="
                 "
              >
                <Markdown children={description} />
              </div>
            </div>

            {/* Back Button */}
            <RouterLink
              href={paths.blog.root}
              className="inline-flex items-center gap-2 mt-2 px-0 py-2 rounded-lg text-sm text-gray-500 hover:text-primary hover:bg-primary/8 transition-all duration-200"
            >
              <Iconify icon="solar:arrow-left-linear" width={20} />
              Back to all articles
            </RouterLink>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-4">
            <div className="md:sticky md:top-24 flex flex-col gap-6">

              {/* Recent Posts */}
              <div className="p-3 rounded-3xl bg-white  border border-gray-500/12">
                <div className="flex flex-col gap-6">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    {/* <div className="w-1 h-6 rounded bg-primary" /> */}
                    <h3 className="text-base font-bold text-gray-900 ">
                      Recent Posts
                    </h3>
                  </div>

                  {/* Posts list */}
                  {blogsLoading ? (
                    <SidebarSkeleton />
                  ) : recentBlogs.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {recentBlogs.map((recentBlog) => (
                        <RecentBlogCard key={recentBlog.id} blog={recentBlog} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No other posts available
                    </p>
                  )}

                  {/* View All */}
                  {recentBlogs.length > 0 && (
                    <RouterLink
                      href={paths.blog.root}
                      className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg border border-gray-500/24 text-sm font-medium text-gray-900 dark:text-gray-100 hover:border-primary hover:bg-primary/8 transition-all duration-200"
                    >
                      View All Posts
                      <Iconify icon="solar:arrow-right-linear" width={18} />
                    </RouterLink>
                  )}
                </div>
              </div>

              {/* Newsletter Card */}
              {/* <div
                className="p-3 rounded-3xl text-white text-center"
                style={{
                  background: "linear-gradient(135deg, var(--palette-primary-main) 0%, var(--palette-primary-dark) 100%)",
                }}
              >
                <div className="flex flex-col items-center gap-2">
                
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                    <Iconify icon="solar:letter-bold" width={28} />
                  </div>

                  <h3 className="text-base font-bold">Stay Updated</h3>

                  <p className="text-sm opacity-90 leading-relaxed">
                    Subscribe to our newsletter for the latest articles and updates.
                  </p>

                  <button className="mt-1 w-full py-2 px-4 rounded-lg bg-white text-[#000000] font-semibold text-sm hover:bg-white/90  duration-200">
                    Subscribe Now
                  </button>
                </div>
              </div> */}

            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {isLoading && renderLoading()}
      {isBlogFound && renderBlog()}
      {isBlogMissing && renderError()}
    </>
  );
}