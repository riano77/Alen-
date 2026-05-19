export async function generateAIContent(prompt: string, systemInstruction?: string) {
  const response = await fetch("/api/ai/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, systemInstruction }),
  });
  if (!response.ok) throw new Error("Failed to generate content");
  return response.json();
}

export async function summarizeNote(content: string) {
  const response = await fetch("/api/ai/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error("Failed to summarize note");
  return response.json();
}
