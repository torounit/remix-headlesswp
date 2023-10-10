import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/cloudflare";
import type { WP_REST_API_Page } from "wp-types";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const post = data?.post as WP_REST_API_Page | undefined;
  return [{ title: post ? post?.title?.rendered : "not found" }];
};

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const slug = params.slug || "";

  if (!slug) {
    throw new Response(null, {
      status: 500,
      statusText: "Bad Request",
    });
  }

  const url = (context.env as any).WP_URL as string
  console.log(`${url}/wp-json/wp/v2/pages/?slug=${slug}_embed`);
  const response = await fetch(`${url}/wp-json/wp/v2/pages/?slug=${slug}&_embed`);
  const pages = await response.json<WP_REST_API_Page[]>();

  if (!pages.length) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const post = pages[0];
  return json({ post });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const post = data?.post as WP_REST_API_Page | undefined;

  if (!post) {
    return (
      <div className="mx-auto w-full max-w-5xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
        <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">Not
          found.</h1>
      </div>
    );
  }

  return (
    <article className="mx-auto w-full max-w-5xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
      <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
        {post.title.rendered}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }}/>
    </article>
  );
}
