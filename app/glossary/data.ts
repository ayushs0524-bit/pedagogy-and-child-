export type GlossaryTerm = {
  english: string;
  hindi: string;
  santali: string;
};

// Class 3 maths vocabulary. Santali entries follow the same
// PENDING_NATIVE_TRANSLATION caution as the main dataset — replace with
// native-speaker-verified terms as they become available.
export const glossaryTerms: GlossaryTerm[] = [
  { english: "Add / Plus", hindi: "जोड़ना", santali: "ᱥᱮᱨᱮᱧ" },
  { english: "Subtract / Minus", hindi: "घटाना", santali: "ᱵᱟᱜ" },
  { english: "Multiply", hindi: "गुणा करना", santali: "ᱜᱩᱬᱤᱡᱽ" },
  { english: "Divide", hindi: "भाग करना", santali: "ᱵᱟᱴᱟᱣ" },
  { english: "Number", hindi: "संख्या", santali: "ᱦᱤᱥᱟᱹᱵ" },
  { english: "Total / Sum", hindi: "कुल / योग", santali: "ᱡᱩᱲᱟᱹᱣ" },
  { english: "Equal", hindi: "बराबर", santali: "ᱥᱚᱢᱟᱱ" },
  { english: "More", hindi: "ज़्यादा", santali: "ᱡᱟᱹᱥᱛᱤ" },
  { english: "Less", hindi: "कम", santali: "ᱦᱚᱰᱚᱭ" },
  { english: "Count", hindi: "गिनती", santali: "ᱨᱮᱠᱷᱟ" },
  { english: "Shape", hindi: "आकार", santali: "ᱨᱩᱯ" },
  { english: "Circle", hindi: "वृत्त", santali: "ᱜᱚᱲ" },
  { english: "Zero", hindi: "शून्य", santali: "ᱥᱩᱱᱭᱟᱹ" },
  { english: "One", hindi: "एक", santali: "ᱢᱤᱫ" },
  { english: "Half", hindi: "आधा", santali: "ᱟᱹᱫᱷᱟ" },
];
