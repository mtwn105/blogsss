// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

type Request = {
  title: string,
  content: string,
  tags: string,
  coverImage: string,
  subtitle: string,
  hashnodeApiKey: string,
}

const HASHNODE_URL = `https://api.hashnode.com`;
const HASHNODE_POST_URL = `https://hashnode.com/post/`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  const { title, content, tags, hashnodeApiKey, coverImage, subtitle
  } = req.body as Request;

  // Validate required parameters
  if (!title || !content || !tags || !hashnodeApiKey) {
    res.status(400).json({
      error: 'Missing required parameters'
    });
    return;
  }

  try {

    const response = await axios.post(HASHNODE_URL, {
      query: 'mutation createStory($input: CreateStoryInput!){ createStory(input: $input){ code success message post {  cuid  slug  } } }',
      variables: {
        input: {
          title,
          contentMarkdown: content,
          tags: [],
          coverImageURL: coverImage,
          subtitle,
        },
      },
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': hashnodeApiKey
      }
    });

    if (!!response.data.data && !!response.data.data.createStory && !!response.data.data.createStory.post) {

      const url = HASHNODE_POST_URL + response.data.data.createStory.post.slug + "-" + response.data.data.createStory.post.cuid

      res.status(200).json({ url });


    } else {
      console.log(response.data.errors);
      console.log(JSON.stringify(response.data.errors));
      res.status(500).json({
        error: 'Error publishing to Hashnode',
        message: response.data.errors[0].message
      });
      return;
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: 'Error publishing to Hashnode',
    });
    return;
  }


}
