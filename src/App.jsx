import { useState, useEffect, useRef } from "react";

function App() {
  const determinersWords = ["el","la","los","las","un","una","unos","unas","mi","mis","tu","tus","su","sus","nuestro","nuestra","nuestros","nuestras","vuestro","vuestra","vuestros","vuestras","este","esta","estos","estas","ese","esa","esos","esas","aquel","aquella","aquellos","aquellas","algún","alguna","algunos","algunas","ningún","ninguna","ningunos","ningunas","cada","otro","otra","otros","otras","varios","varias","mucho","mucha","muchos","muchas","poco","poca","pocos","pocas","demasiado","demasiada","demasiados","demasiadas","bastante","bastantes","todo","toda","todos","todas","cierto","cierta","ciertos","ciertas","uno","una","dos","tres","cuatro","cinco","seis","siete","ocho","nueve","diez","primer","primero","primera","segundo","segunda","tercer","tercero","tercera","medio","media","medios","medias","qué","cuál","cuánto","cuánta","cuántos","cuántas"];
  const prepositionWords = ["a","ante","bajo","cabe","con","contra","de","desde","en","entre","hacia","hasta","para","por","según","sin","so","sobre","tras"];
  const pronounWords = ["yo","tú","usted","él","ella","nosotros","nosotras","vosotros","vosotras","ustedes","ellos","ellas","me","te","se","nos","os","lo","la","los","las","le","les","este","esta","estos","estas","ese","esa","esos","esas","aquel","aquella","aquellos","aquellas","que","quien","quienes","cual","cuales","cuyo","cuya","cuyos","cuyas","alguien","algo","nadie","nada","cada uno","cada una","uno","una","unos","unas","otro","otra","otros","otras","cierto","cierta","ciertos","ciertas","varios","varias","mucho","mucha","muchos","muchas","poco","poca","pocos","pocas","quién","qué","cuál","cuánto","cuánta","cuántos","cuántas"];
  const conjunctionsWords = ["y","e","ni","que","o","u","pero","aunque","sino","mas","porque","pues","como","si"];
  const commonAdverbsWords = ["aquí","allí","ahí","allá","ayer","hoy","mañana","antes","después","luego","siempre","nunca","jamás","quizás","quizá","muy","más","menos","tan","así","bien","mal","casi","ya","todavía","pronto","temprano"];
  
  const keywordInputRef = useRef(null);

  const [text, setText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [averageWordLength, setAverageWordLength] = useState(0);
  const [longestWord, setLongestWord] = useState({ word: "", length: 0 });
  const [keywords, setKeywords] = useState([]);
  const [keywordCounts, setKeywordCounts] = useState([]);
  const [mostCommonWords, setMostCommonWords] = useState([]);

  const [ignoreDeterminers, setIgnoreDeterminers] = useState(true);
  const [ignorePrepositions, setIgnorePrepositions] = useState(true);
  const [ignorePronouns, setIgnorePronouns] = useState(true);
  const [ignoreAdverbs, setIgnoreAdverbs] = useState(true);
  const [ignoreConjunctions, setIgnoreConjunctions] = useState(true);

  const getExcludedWords = () => {
    let words = [];
    if (ignoreDeterminers) words = [...words, ...determinersWords];
    if (ignorePrepositions) words = [...words, ...prepositionWords];
    if (ignorePronouns) words = [...words, ...pronounWords];
    if (ignoreAdverbs) words = [...words, ...commonAdverbsWords];
    if (ignoreConjunctions) words = [...words, ...conjunctionsWords];
    return new Set(words);
  };

  useEffect(
    () => analyzeText(),
    [
      text,
      ignoreDeterminers,
      ignorePrepositions,
      ignorePronouns,
      ignoreAdverbs,
      ignoreConjunctions,
    ]
  );
  useEffect(() => countKeywords(), [keywords]);

  const analyzeText = () => {
    setCharCount(text.length);

    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);

    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length);
    setSentenceCount(sentences.length);

    const paragraphs = text.split("\n").filter((p) => p.trim().length);
    setParagraphCount(paragraphs.length);

    const totalLength = words.reduce((sum, w) => sum + w.length, 0);
    setAverageWordLength(
      words.length ? (totalLength / words.length).toFixed(2) : 0
    );

    const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");
    setLongestWord({ word: longest, length: longest.length });

    const excludedWords = getExcludedWords();
    const counts = {};
    words.forEach((w) => {
      const lw = w.toLowerCase();
      if (!excludedWords.has(lw)) {
        counts[lw] = (counts[lw] || 0) + 1;
      }
    });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    setMostCommonWords(sorted);
  };

  const addKeyword = () => {
    const kw = keywordInputRef.current.value.trim();
    if (kw && !keywords.includes(kw)) setKeywords([...keywords, kw]);
    keywordInputRef.current.value = "";
  };

  const countKeywords = () => {
    setKeywordCounts(
      keywords.map((k) => {
        const matches = text.match(new RegExp(`\\b${k}\\b`, "gi"));
        return { word: k, count: matches?.length ?? 0 };
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-3xl lg:max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-amber-500 mb-4">
        Contador y analizador de texto fácil y rápido
        </h1>
        <div className="flex space-x-4">
          <textarea
            className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition mb-4 resize-y"
            placeholder="Escriba o pegue su texto aquí..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex flex-col">
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                ref={keywordInputRef}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                placeholder="Añadir una palabra clave"
              />
              <button
                onClick={addKeyword}
                className="px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition"
              >
                +
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setIgnorePrepositions(!ignorePrepositions)}
                className={`px-4 py-1 rounded-full border ${
                  ignorePrepositions
                    ? "bg-amber-100 text-amber-700 border-amber-300"
                    : "bg-gray-200 text-gray-600 border-gray-300"
                }`}
              >
                {ignorePrepositions ? "✓" : "✗"} Ignorar proposiciones
              </button>
              <button
                onClick={() => setIgnoreConjunctions(!ignoreConjunctions)}
                className={`px-4 py-1 rounded-full border ${
                  ignoreConjunctions
                    ? "bg-amber-100 text-amber-700 border-amber-300"
                    : "bg-gray-200 text-gray-600 border-gray-300"
                }`}
              >
                {ignoreConjunctions ? "✓" : "✗"} Ignorar conjunciones
              </button>
              <button
                onClick={() => setIgnorePronouns(!ignorePronouns)}
                className={`px-4 py-1 rounded-full border ${
                  ignorePronouns
                    ? "bg-amber-100 text-amber-700 border-amber-300"
                    : "bg-gray-200 text-gray-600 border-gray-300"
                }`}
              >
                {ignorePronouns ? "✓" : "✗"} Ignorar pronombres
              </button>
              <button
                onClick={() => setIgnoreAdverbs(!ignoreAdverbs)}
                className={`px-4 py-1 rounded-full border ${
                  ignoreAdverbs
                    ? "bg-amber-100 text-amber-700 border-amber-300"
                    : "bg-gray-200 text-gray-600 border-gray-300"
                }`}
              >
                {ignoreAdverbs ? "✓" : "✗"} Ignorar adverbios
              </button>
              <button
                onClick={() => setIgnoreDeterminers(!ignoreDeterminers)}
                className={`px-4 py-1 rounded-full border ${
                  ignoreDeterminers
                    ? "bg-amber-100 text-amber-700 border-amber-300"
                    : "bg-gray-200 text-gray-600 border-gray-300"
                }`}
              >
                {ignoreDeterminers ? "✓" : "✗"} Ignorar determinantes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Caracteres :</span> {charCount}
                </p>
                <p>
                  <span className="font-semibold">Palabras:</span> {wordCount}
                </p>
                <p>
                  <span className="font-semibold">Frases:</span>
                  {sentenceCount}
                </p>
                <p>
                  <span className="font-semibold">Párrafos:</span>
                  {paragraphCount}
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Longitud media:</span>{" "}
                  {averageWordLength}
                </p>
                <p>
                  <span className="font-semibold">Palabra más larga:</span>{" "}
                  {longestWord.word} ({longestWord.length} caracteres)
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Palabras clave</h2>
              <ul className="flex flex-wrap gap-2">
                {keywords.map((keyword, i) => (
                  <li
                    key={i}
                    className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full"
                  >
                    {keyword}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Numero palabras claves</h2>
              <ul className="list-disc list-inside">
                {keywordCounts.map((keyword, i) => (
                  <li key={i}>
                    {keyword.word}: {keyword.count}
                  </li>
                ))}
              </ul>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">Top 5 palabra más comunes</h2>
              <ul className="list-disc list-inside">
                {mostCommonWords.map(([word, count], i) => (
                  <li key={i}>
                    {word}: {count}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
