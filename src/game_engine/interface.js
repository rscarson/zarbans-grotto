export class Interface {
    static getTitledBox(title, inner_text_lines) {
        let box_width = Math.max(...inner_text_lines.map(l => l.length).concat([title.length])) + 2;        
        let output = [
            `╔${'═'.repeat(box_width)}╗`,
            `║ ${title}${' '.repeat(box_width-title.length-1)}║`,
            `╟${'─'.repeat(box_width)}╢`
        ]

        for (const line of inner_text_lines) {
            output.push(`║ ${line}${' '.repeat(box_width-line.length-1)}║`)
        }

        output.push(`╚${'═'.repeat(box_width)}╝`);
        return output;
    }

    static getPlayerDetailString(player, debug=false) {
        let output = [];
        for (const s of debug ? player.status.list() : player.status.list_visible()) {
            let status = player.status.get(s);
            let name = s.charAt(0).toUpperCase() + s.slice(1);
            output.push(`${name} : ${status.value} / ${status.maximum}`);
        }

        let items = player.inventory.all_equipped();
        if (items.length) {
            output.push('');
            output.push('Equipment:');
            for (const item of player.inventory.all_equipped()) {
                output.push(`- ${item.description}`);
            }
        } 

        if (debug) {
            output.push('');
            output.push('Choices:');
            for (const choice of player.choices.list().filter(c => player.choices.chose(c))) {
                output.push(`- ${choice}`);
            }
        }

        return output;
    }

    static getInterfaceString(player, has_error=false) {
        let playerStats = player.getAdjustedStats();
        let title = playerStats.currentChapter.name;
        let inner_text = [
            '',
            ...playerStats.currentStory.text,
            '',
            ...this.getPlayerDetailString(playerStats, process.env.DEBUG_ZARBAN)
        ];

        let options = playerStats.currentStory.options.filter(o => playerStats.validateConditions(o.conditions));        
        let prompt = [
            `${has_error ? 'Invalid selection. ' : ''}What do you do?`,
            ...options.map((o,i) => `${i+1}) ${o}`)
        ];

        return [
            ...this.getTitledBox(title, inner_text),
            '',
            ...prompt
        ].join('\n');
    }
}

/*
TODO
! Apply effects to status markers in player class
- Add operations to effects (set, add, set_max, add_max)
- Use effected markers in condition checks and UI drawing

╔════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ Chapter 1: The Grotto                                                                                                                                      ║
╟────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╢
║ Drenched from the rain, and exhausted from having hunted all through the night, you have finally cornered the beast which you have been hired to dispatch. ║
║ You approach the forboding cavern to which you have stalked your prey, the shapeshifting vampire Zarban.                                                   ║
║ The foul stench of magic fills your nostrils as you prepare to enter the grotto proper.                                                                    ║
║                                                                                                                                                            ║
║ Stamina 6/10                                                                                                                                               ║
║                                                                                                                                                            ║
║ Equipment:                                                                                                                                                 ║
║ - Vampire Hunter's Armor (+8 Max Stamina)                                                                                                                  ║
║ - Enchanted Sword                                                                                                                                          ║
╚════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝

What do you do?
1) Draw your magic sword and approach the shadow
2) I don't care about vampires, let's go to the tavern


*/