import { GoogleGenAI } from "@google/genai";

export async function handler(event) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  try {
    // const { prompt } = JSON.parse(event.body);

    // // Convert the object beats into a clear list
    // const formattedPrompt = Object.entries(prompt)
    //   .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
    //   .join("\n");

    // const response = await ai.models.generateContent({
    //   model: "gemini-2.5-flash",
    //   contents: `ACT AS A PROFESSIONAL SCREENWRITER.

    //   TASK:
    //   Expand the following 15 story beats into a professional screenplay treatment.

    //   USER BEATS:
    //   ${formattedPrompt}

    //   FORMATTING INSTRUCTIONS:
    //   1. Use Fountain Syntax.
    //   2. Scene Headings start with INT. or EXT.
    //   3. Character names must be ALL CAPS on their own line.
    //   4. DO NOT provide a summary of an existing movie.
    //   5. DO NOT include any conversational filler (e.g., "Here is your script").
    //   6. Return ONLY the screenplay text.`,
    // });

    // // Directly access the text (Removed the JSON.parse that was causing the crash)
    // const cleanText = response.text;
    const test = {
      script:
        "# A TOUCH OF SWEETNESS\n\n## TREATMENT\n\n### OPENING\n\nINT. ELARA'S BAKERY - MORNING\n\nThe bell above the door jingles, an old, tired sound. DUST MOTES dance in the lone shaft of sunlight slicing through the window. ELARA (20s), flour dusting her apron, meticulously pipes frosting onto a generic cupcake. The bakery, \"The Daily Loaf,\" is charmingly rustic but visibly worn. Empty display cases mock her efforts. She sighs, wiping a stray hair from her brow. Another slow morning.\n\n### THEME\n\nINT. ELARA'S BAKERY - LATER\n\nLEO (20s), Elara's loyal best friend and only employee, stacks unsold bread.\n\nLEO\nYou know, your grandmother always said the secret wasn't just in the recipe, it was in the heart you put into it. The bit that makes it *yours*.\n\nElara just shrugs, a flicker of doubt in her eyes. She’s trying to keep the bakery afloat with her grandmother’s traditional recipes, but they’re not sparking joy, or sales.\n\n### SETUP\n\nINT. ELARA'S BAKERY / APARTMENT - DAY\n\nWe follow Elara's monotonous routine: waking up before dawn, kneading dough, baking standard fare. The mail brings a grim letter from the bank – a FINAL NOTICE for overdue mortgage payments. The bakery is barely breaking even. Elara avoids looking at the old, faded photo of her beaming grandmother on the wall. Her own creativity feels stifled, chained to tradition and fear of failure. Across the street, a large, garish sign for \"MEGA-MUFFIN MART\" goes up on an empty storefront.\n\n### CATALYST\n\nINT. ELARA'S BAKERY - DAY\n\nA bank MANAGER, stiff-suited and humorless, stands opposite Elara. He informs her she has exactly ONE MONTH to bring her accounts current or the bank will initiate foreclosure proceedings. As he leaves, the MEGA-MUFFIN MART across the street officially opens, blasting pop music and offering \"BUY ONE GET ONE FREE\" muffins. Elara watches, horrified, as a stream of customers bypasses her quaint shop entirely.\n\n### DEBATE\n\nINT. ELARA'S BAKERY - NIGHT\n\nElara paces the empty bakery. Her mind races. Should she just give up? Sell the bakery before the bank takes it? Try to compete with Mega-Muffin Mart by lowering prices and sacrificing quality? She looks at the old oven, the worn counters, the legacy. Tears well in her eyes. It feels impossible. Leo tries to offer solace, but she's deep in her own doubt.\n\n### BREAK INTO 2\n\nINT. ELARA'S BAKERY - MORNING\n\nA fierce resolve hardens Elara’s gaze. No. She won’t let them take it. She won’t abandon her grandmother’s dream. But she can’t do it the old way. She pulls out a forgotten sketchbook filled with wild, innovative pastry ideas she'd created in culinary school – flavors, shapes, and concepts completely different from the traditional offerings. She decides to throw caution to the wind and create a signature line of unique, artisanal pastries.\n\n### B STORY\n\nINT. ELARA'S BAKERY - DAY\n\nMRS. HENDERSON (70s), a long-time customer with a sharp wit and even sharper observations, enters. She orders her usual, but her eyes linger on Elara's new, experimental ingredients. She offers cryptic advice about \"finding your own sugar,\" hinting at Elara's unique talent beyond mere replication. Mrs. Henderson becomes a quiet, guiding presence, offering a different perspective than Leo's more direct encouragement.\n\n### FUN AND GAMES\n\nINT. ELARA'S BAKERY - DAYS\n\nA MONTAGE of experimentation. Elara bakes with renewed vigor, transforming the bakery into a laboratory of flavor.\n- Failed attempts: a lavender scone that tastes like soap, a pretzel croissant that crumbles.\n- Leo makes jokes about her \"mad scientist\" phase.\n- Small successes: A new \"Rosewater Pistachio Delight\" that looks promising. A few curious customers try samples, their eyes widening in surprise.\n- The energy in the bakery slowly shifts from desperation to creative excitement. Elara starts to rediscover her passion.\n\n### MIDPOINT\n\nINT. ELARA'S BAKERY - DAY\n\nElara perfects her \"Crimson Berry Tartlet\" – a vibrant, jewel-toned pastry with complex layers of flavor. She places a tray in the display case. A local food blogger, known for her discerning palate, happens to walk in. She samples the tartlet, her expression unreadable. Then, she beams. She praises its originality and taste, promising a feature on her blog. Sales of the new tartlet immediately pick up, giving Elara a much-needed boost of confidence and cash. Hope flickers brightly.\n\n### BAD GUYS CLOSE IN\n\nINT. ELARA'S BAKERY - WEEK\n\nThe positive buzz attracts Mega-Muffin Mart's attention. They launch an aggressive \"Price Match Guarantee\" campaign, even lowering prices below cost. The bank calls, reminding Elara of the looming deadline despite her recent small deposit. An old oven unexpectedly breaks down, costing a significant amount for repairs. The initial surge of interest in Elara's new pastries starts to wane as customers are lured by Mega-Muffin Mart’s aggressive tactics.\n\n### ALL IS LOST\n\nINT. ELARA'S BAKERY - NIGHT\n\nDisaster strikes. Elara, exhausted and stressed, accidentally burns a huge batch of her Crimson Berry Tartlets the night before a crucial local food festival. The aroma of charred sugar fills the air. She stares at the ruined pastries, the last of her special ingredients gone. The bank calls, confirming they are moving forward with the foreclosure. Elara collapses into a chair, utterly defeated. There's no way she can recover.\n\n### DARK NIGHT OF THE SOUL\n\nINT. ELARA'S BAKERY - DAWN\n\nElara sits in the darkness of her bakery, surrounded by the smell of failure. Leo finds her there, offering silent comfort. Elara confesses her fears, her belief that she's simply not good enough, that her dreams were foolish. Mrs. Henderson enters, sensing Elara’s despair. She doesn't offer pity, but instead reminds Elara of her grandmother’s spirit, of the unique \"spark\" Elara always had, even as a child. Elara remembers a childhood memory of her grandmother encouraging her messy, imaginative baking.\n\n### BREAK INTO 3\n\nINT. ELARA'S BAKERY - DAY\n\nA spark ignites in Elara’s eyes. She looks at the ruined oven, the simple tools. She can't compete on price or scale, but she can compete on soul. She won't just make unique pastries; she'll embrace the *story* behind them, the artisanal, imperfect beauty. She decides to throw a \"Grand Reopening\" on the last day before the foreclosure, focusing on truly unique, limited-edition creations, even with the broken oven. It’s her last stand, her true voice.\n\n### FINALE\n\nEXT. ELARA'S BAKERY - DAY\n\nThe Grand Reopening. Elara has revamped the bakery, embracing its rustic charm with handmade decorations and handwritten signs detailing the stories behind each unique pastry. A small crowd gathers, drawn by the unusual buzz. The bank manager is there, pen in hand. Elara, nervous but confident, proudly unveils her new creations, even a few slightly \"imperfect\" ones born from the broken oven – telling their stories, sharing her passion. People taste, they connect, they are charmed. The line grows longer and longer. The bank manager, witnessing the unexpected success and the growing sales, reconsiders, offers a new payment plan. Mega-Muffin Mart across the street looks deserted. Elara has saved her bakery, not by changing who she is, but by fully becoming herself.\n\n### FINAL IMAGE\n\nINT. ELARA'S BAKERY - DAY\n\nElara, beaming, stands behind the counter of her now bustling bakery. Her unique, beautiful pastries are flying off the shelves. Leo is happily serving customers. Mrs. Henderson sips tea, a knowing smile on her face. Elara looks truly content, a confident artist in her element, the morning sun streaming brightly through the window, illuminating her original, vibrant creations.",
    };
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Good for local development
      },
      // We send it back as a JSON string so the frontend can use .json()
      body: JSON.stringify({ script: test }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
