import FlashcardsAPIHandlers from "./FlashcardsAPIHandlers";

export default [
  {
    method: 'get', path: '/flashcards',
    handler: FlashcardsAPIHandlers.getFlashcards
  },
  {
    method: 'post', path: '/flashcards/answer',
    handler: FlashcardsAPIHandlers.answerFlashcard
  }
]
