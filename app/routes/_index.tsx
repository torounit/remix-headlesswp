import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import type { WP_REST_API_Pages, WP_REST_API_Post, WP_REST_API_Posts } from "wp-types";
import { Link, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const getPosts = async (url: string, page: number, perPage: number) => {
  const result = await fetch(`${url}/wp-json/wp/v2/posts/?_embed&page=${page}&per_page=${perPage}`);
  return await result.json<WP_REST_API_Posts>();
}

const getPages = async (url: string) => {
  const result = await fetch(`${url}/wp-json/wp/v2/pages/?_embed&&per_page=100`);
  return await result.json<WP_REST_API_Pages>();
}

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const perPage = 10;
  const page = 1;
  const url = (context.env as any).WP_URL as string
  const [ pages, posts] = await Promise.all([
    getPages(url),
    getPosts(url, page, perPage)
  ])
  return json({ pages, posts });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const posts = data?.posts as WP_REST_API_Posts | undefined;
  const pages = data?.pages as WP_REST_API_Posts | undefined;

  return (
    <div>
      <h1 className="mb-12 text-xl font-bold">Posts</h1>
      {posts ? (
        <ul>
          {posts.map((post: WP_REST_API_Post) => (
            <li
              key={post.id}
              className="mb-8 text-2xl font-extrabold leading-tight text-gray-900 lg:mb-12 dark:text-white"
            >
              <Link to={`/posts/${post.id}`}>{post.title.rendered}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>Nothing.</div>
      )}

      <h1 className="mb-12 text-xl font-bold">Pages</h1>
      {pages ? (
        <ul>
          {pages.map((post: WP_REST_API_Post) => (
            <li
              key={post.id}
              className="mb-8 text-2xl font-extrabold leading-tight text-gray-900 lg:mb-12 dark:text-white"
            >
              <Link to={`/${post.slug}`}>{post.title.rendered}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>Nothing.</div>
      )}
    </div>
  );
}
