const { Pinecone } = require("@pinecone-database/pinecone");
const OpenAI = require("openai").OpenAI;

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index(process.env.PINECONE_INDEX);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function embedAndUpsert(texts, meta) {
  if (!Array.isArray(texts)) {
    throw new Error(`Expected texts to be an array, got ${typeof texts}`);
  }

  if (texts.length === 0) {
    console.log("No chunks to embed");
    return;
  }

  console.log(`Embedding ${texts.length} chunks`);

  const batchSize = 100;

  for (let i = 0; i < texts.length; i += batchSize) {
    const slice = texts.slice(i, i + batchSize);
    const { data } = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: slice,
      dimensions: 1024,
    });

    const vectors = data.map((e, j) => ({
      id: crypto.randomUUID(),
      values: e.embedding,
      metadata: {
        chunk_index: i + j,
        ...meta,
        chunk_text: slice[j],
      },
    }));

    await index.namespace(meta.mentor_id).upsert(vectors);
  }
}

module.exports = { embedAndUpsert };
