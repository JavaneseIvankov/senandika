
# 🧠 Query Rewriting / Contextualization — RAG Improvement Guide

## Problem
In a chatbot with RAG (Retrieval-Augmented Generation), we often embed the **raw user question**
directly and use it for vector search.  
However, if the user question depends on previous context, this leads to wrong retrieval.

Example:
```

User: "Where did he go?"

```
If we embed this question as-is, the search fails because the database
doesn’t know who “he” refers to.

---

## Idea: Query Rewriting (Contextualization)
Before running vector search, we should **rewrite the user query** into a *fully self-contained version*
that includes context from previous turns in the conversation.

Example:
```

User: "Where did he go?"
Conversation history: ["Budi said he was leaving yesterday."]
Rewritten query: "Where did Budi go yesterday?"

````

By embedding the rewritten query instead of the raw input,
we retrieve memories that are semantically related to the actual topic (Budi, leaving, yesterday)
— not just to the ambiguous phrase “he”.

---

## Implementation Sketch (Next.js + AISDK + NeonDB)

```ts
import { embed, aiModel } from "@/lib/ai"; // your AISDK wrappers
import { db } from "@/lib/db"; // Neon client

async function retrieveContext(userInput, history) {
  // (1) Rewrite the query based on conversation history
  const rewrittenQuery = await aiModel.rewriteQuery({
    userInput,
    history
  });

  // (2) Generate embedding from rewritten query
  const queryEmbedding = await embed(rewrittenQuery);

  // (3) Use hybrid similarity (question + answer embeddings)
  const results = await db.query(`
    SELECT id, question, answer
    FROM memory
    ORDER BY (
      0.7 * cosine_similarity(answer_embedding, $1)
      + 0.3 * cosine_similarity(question_embedding, $1)
    ) DESC
    LIMIT 5
  `, [queryEmbedding]);

  // (4) Combine retrieved answers as RAG context
  return results.map(r => r.answer).join("\n");
}
````

---

## Benefits

* Makes ambiguous queries clear before embedding.
* Greatly improves retrieval accuracy for multi-turn chat.
* Keeps system modular — rewriting step can be swapped or fine-tuned independently.

---

## Recommended Model Behavior

When implementing `aiModel.rewriteQuery`, instruct the model:

> “Rewrite the latest user message into a complete, standalone query that preserves its meaning in context of the previous conversation.”

---

This step transforms RAG retrieval from *“semantic similarity to query”*
→ *“semantic relevance to the underlying intent of the query”*.

```

---

Kalimat ini aman buat dijadikan komentar panjang di project, misalnya di:
```

/src/lib/rag/README.md

```
atau di atas fungsi retrieval utama.  
