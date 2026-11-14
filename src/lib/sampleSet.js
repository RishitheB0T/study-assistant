// Hand-written study set in exactly the shape the AI must return.
// It lets us build every screen before the AI is connected.
export const sampleSet = {
  title: 'Photosynthesis',
  items: [
    {
      type: 'flashcard',
      id: '1',
      front: 'What is photosynthesis?',
      back: 'How plants turn light, water and carbon dioxide into glucose and oxygen.',
    },
    {
      type: 'flashcard',
      id: '2',
      front: 'Where in the cell does photosynthesis happen?',
      back: 'In the chloroplasts.',
    },
    {
      type: 'flashcard',
      id: '3',
      front: 'Which pigment absorbs the light?',
      back: 'Chlorophyll.',
    },
    {
      type: 'mcq',
      id: '4',
      question: 'Which gas do plants take in for photosynthesis?',
      options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'],
      answerIndex: 1,
      explanation: 'Plants take in carbon dioxide and give out oxygen.',
    },
    {
      type: 'mcq',
      id: '5',
      question: 'Which sugar does photosynthesis make first?',
      options: ['Glucose', 'Sucrose', 'Lactose', 'Maltose'],
      answerIndex: 0,
      explanation: 'Glucose is made first; the plant can turn it into other sugars later.',
    },
    {
      type: 'mcq',
      id: '6',
      question: 'Which part of the plant catches most of the light?',
      options: ['Roots', 'Stem', 'Leaves', 'Seeds'],
      answerIndex: 2,
      explanation: 'Leaves are thin, wide and packed with chloroplasts.',
    },
  ],
}
