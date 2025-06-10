import { cookbookData } from "data/food/cookbookData";

export class CookbookClass {
    static checkLore(player, mainhand) {
        const lore = mainhand.getLore();
        if (lore.length === 0) {
            this.setRecipe(player, mainhand);
            return;
        }
        else if (lore.some(line => line.includes("###"))) {
            this.upgradeRecipe(player, mainhand, lore);
            return;
        }
        else if (lore.some(line => line.includes("?"))) {
            lore.replace("?", "완성된 요리");
            return;
        }
        else {
            player.sendMessage("이미 작성이 완료된 요리책입니다");
            return;
        }
    }

    static setRecipe(player, mainhand) {
        let cookbookString = "";
        let recipeData;
        switch (mainhand.typeId) {
            case "fs:low_cookbook":
                recipeData = cookbookData.lowCookbook;
                cookbookString += "§f하급 ";
                break;
            case "fs:middle_cookbook":
                recipeData = cookbookData.middleCookbook;
                cookbookString += "§b중급 ";
                break;
            case "fs:high_cookbook":
                recipeData = cookbookData.highCookbook;
                cookbookString += "§d상급 ";
                break;
            case "fs:legendary_cookbook":
                recipeData = cookbookData.legendaryCookbook;
                cookbookString += "§e전설 ";
                break;
        }
        const randomRecipe = Math.floor(Math.random() * recipeData.length);
        const cookbook = recipeData[randomRecipe];
        cookbookString += `${randomRecipe + 1}번 레시피\n[ 결과물 : ? ]\n[ 재료 : `;

        const randomIngredient = Math.floor(Math.random() * cookbook.ingredient.length);

        cookbook.ingredient.forEach((ingredient, index) => {
            if (index === randomIngredient) {
                cookbookString += `${ingredient} `; // 공개된 재료
            } else {
                cookbookString += "### "; // 숨겨진 재료
            }
        });
        cookbookString += "]";
        mainhand.setLore([cookbookString]);
        player.dimension.playSound("ui.cartography_table.take_result", player.location);
    }

    static upgradeRecipe(player, mainhand, lore) {
        let recipeData;
        switch (mainhand.typeId) {
            case "fs:low_cookbook":
                recipeData = cookbookData.lowCookbook;
                break;
            case "fs:middle_cookbook":
                recipeData = cookbookData.middleCookbook;
                break;
            case "fs:high_cookbook":
                recipeData = cookbookData.highCookbook;
                break;
            case "fs:legendary_cookbook":
                recipeData = cookbookData.legendaryCookbook;
                break;
        }
    }
}