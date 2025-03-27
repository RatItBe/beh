export class BurnSystem {
    static burnDamage(player) { // entityHurt에서 실행
        const burns = player.getDynamicProperty("burns"); //화상 값 확인
        player.setDynamicProperty("burns", burns + 1);  //화상 값 1 증가
        if (burns > 8 && burns <= 13) player.runCommandAsync("damage @s 1 suicide");
        else if (burns > 13 && burns <= 18) player.runCommandAsync("damage @s 2 suicide");
        else if (burns > 18 && burns <= 23) player.runCommandAsync("damage @s 3 suicide");
        else if (burns > 23) player.runCommandAsync("damage @s 4 suicide");
    }

    static burnCheck(player) { // runInterval20에서 실행

    }
}