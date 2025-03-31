export class DailyRewardSystem {
    static rewardReceipt(player) { // chatSend 에서 실행
        let today = new Date().toLocaleDateString("ko-KR"); // 현재 날짜 가져오기
        let dailyReward = player.getDynamicProperty("dailyReward") || ""; // 기존 출석 데이터 가져오기
        if (dailyReward === today) {
            player.sendMessage("이미 출석 보상을 받았습니다.");
            return;
        }
        player.runCommand("give @s diamond 1");
        player.setDynamicProperty("dailyReward", today);
        player.sendMessage("출석 보상을 수령했습니다.");
    }
}