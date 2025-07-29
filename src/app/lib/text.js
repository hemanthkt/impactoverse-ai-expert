import pdf from "pdf-parse";

// Improved utility functions
function splitIntoParagraphs(text) {
  // Try multiple splitting strategies to handle different PDF formats

  // Strategy 1: Split by double newlines (original)
  let paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  // If we only get 1 paragraph, try other strategies
  if (paragraphs.length <= 1) {
    // Strategy 2: Split by single newlines and filter out short lines
    paragraphs = text
      .split(/\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 20) // Filter out short lines (headers, page numbers, etc.)
      .filter(Boolean);
  }

  // If still only 1 paragraph, try sentence-based splitting
  if (paragraphs.length <= 1) {
    // Strategy 3: Split by sentences (periods followed by space and capital letter)
    paragraphs = text
      .split(/(?<=[.!?])\s+(?=[A-Z])/)
      .map((p) => p.trim())
      .filter((p) => p.length > 50) // Filter out very short sentences
      .filter(Boolean);
  }

  // Fallback: Split by fixed character length if all else fails
  if (paragraphs.length <= 1 && text.length > 1000) {
    const chunkSize = 800; // characters per chunk
    paragraphs = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      const chunk = text.substring(i, i + chunkSize);
      if (chunk.trim().length > 0) {
        paragraphs.push(chunk.trim());
      }
    }
  }

  console.log("Splitting strategy result:", {
    totalParagraphs: paragraphs.length,
    firstParagraphLength: paragraphs[0]?.length || 0,
    lastParagraphLength: paragraphs[paragraphs.length - 1]?.length || 0,
  });

  return paragraphs;
}

function toChunks(paras, maxWords = 500) {
  const chunks = [];
  let currentChunk = [];
  let currentWordCount = 0;

  console.log("=== CHUNKING DEBUG ===");
  console.log("Total paragraphs to process:", paras.length);
  console.log("Max words per chunk:", maxWords);

  for (let i = 0; i < paras.length; i++) {
    const para = paras[i];
    const words = para.split(/\s+/).filter((w) => w.length > 0); // Filter empty strings
    const paraWordCount = words.length;

    console.log(
      `Para ${i + 1}: ${paraWordCount} words, running total: ${
        currentWordCount + paraWordCount
      }`
    );

    // If adding this paragraph would exceed the limit, save current chunk
    if (
      currentWordCount + paraWordCount > maxWords &&
      currentChunk.length > 0
    ) {
      const chunkText = currentChunk.join("\n\n");
      chunks.push(chunkText);
      console.log(
        `✅ Created chunk ${chunks.length}: ${currentWordCount} words`
      );

      // Reset for next chunk
      currentChunk = [para];
      currentWordCount = paraWordCount;
    } else {
      // Add paragraph to current chunk
      currentChunk.push(para);
      currentWordCount += paraWordCount;
    }

    // Handle very long paragraphs (longer than maxWords)
    if (paraWordCount > maxWords) {
      console.log(
        `⚠️ Long paragraph detected (${paraWordCount} words), splitting...`
      );

      // If we already have content in currentChunk, save it first
      if (currentChunk.length > 1) {
        // More than just this long paragraph
        currentChunk.pop(); // Remove the long paragraph
        chunks.push(currentChunk.join("\n\n"));
        console.log(
          `✅ Created chunk before long para: ${
            currentWordCount - paraWordCount
          } words`
        );
      }

      // Split the long paragraph by sentences
      const sentences = para
        .split(/(?<=[.!?])\s+/)
        .filter((s) => s.trim().length > 0);
      let tempChunk = [];
      let tempWordCount = 0;

      for (const sentence of sentences) {
        const sentenceWords = sentence.split(/\s+/).filter((w) => w.length > 0);
        const sentenceWordCount = sentenceWords.length;

        if (
          tempWordCount + sentenceWordCount > maxWords &&
          tempChunk.length > 0
        ) {
          chunks.push(tempChunk.join(" "));
          console.log(
            `✅ Created chunk from long para: ${tempWordCount} words`
          );
          tempChunk = [sentence];
          tempWordCount = sentenceWordCount;
        } else {
          tempChunk.push(sentence);
          tempWordCount += sentenceWordCount;
        }
      }

      // Save remaining sentences
      if (tempChunk.length > 0) {
        chunks.push(tempChunk.join(" "));
        console.log(
          `✅ Created final chunk from long para: ${tempWordCount} words`
        );
      }

      // Reset current chunk
      currentChunk = [];
      currentWordCount = 0;
    }
  }

  // Don't forget the last chunk
  if (currentChunk.length > 0) {
    const chunkText = currentChunk.join("\n\n");
    chunks.push(chunkText);
    console.log(`✅ Created final chunk: ${currentWordCount} words`);
  }

  console.log(`=== CHUNKING COMPLETE: ${chunks.length} chunks created ===`);

  return chunks.filter((chunk) => chunk.trim().length > 0);
}

// Main function with better debugging
async function parsePdfToChunks(buf) {
  try {
    const { text } = await pdf(buf);

    console.log("=== PDF PARSING DEBUG ===");
    console.log("Raw text length:", text.length);
    console.log("Raw text sample (first 200 chars):", text.substring(0, 200));
    console.log(
      "Raw text sample (last 200 chars):",
      text.substring(text.length - 200)
    );

    const paragraphs = splitIntoParagraphs(text);
    console.log("Paragraphs count:", paragraphs.length);

    if (paragraphs.length > 1) {
      console.log("First paragraph sample:", paragraphs[0].substring(0, 100));
      console.log(
        "Second paragraph sample:",
        paragraphs[1]?.substring(0, 100) || "N/A"
      );
    }

    const chunks = toChunks(paragraphs, 500);

    console.log("Chunks generated:", chunks.length);
    console.log("Chunks type:", typeof chunks);
    console.log("Chunks length:", chunks.length);

    if (chunks.length > 0) {
      console.log("First chunk sample:", chunks[0].substring(0, 100));
      console.log(
        "Second chunk sample:",
        chunks[1]?.substring(0, 100) || "undefined"
      );
    }

    console.log("Total:", chunks.length);
    console.log("=== END DEBUG ===");

    return { chunks, total: chunks.length };
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw error;
  }
}

module.exports = { parsePdfToChunks };
