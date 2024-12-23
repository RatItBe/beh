export function playerBreakBlock(eventData) {
    const player = eventData.player;
    const itemBefore = eventData.itemStackBeforeBreak;
    
    if (!itemBefore) return;
    const block = eventData.brokenBlockPermutation;
    if (block.type.id.includes("_ore") && itemBefore.typeId.includes("_pickaxe")) {
        const mineAdept = player.getDynamicProperty("mineAdept") || 0;
        player.setDynamicProperty("mineAdept", mineAdept + 1); // 채굴 숙련도 1 증가
    }
}
