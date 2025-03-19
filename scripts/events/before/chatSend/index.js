export function chatSend(eventData) {
    const player = eventData.sender;
    const message = eventData.message;

    if (message === "!출석") { // 출석 체크 명령어
        eventData.cancel = true;
        let today = new Date().toLocaleDateString("ko-KR"); // 현재 날짜 가져오기
        let dailyReward = player.getDynamicProperty("dailyReward") || ""; // 기존 출석 데이터 가져오기
        if (dailyReward === today) {
            player.sendMessage("이미 출석 보상을 받았습니다.");
            return;
        }
        player.runCommandAsync("give @s diamond 1");
        player.setDynamicProperty("dailyReward", today);
        player.sendMessage("출석 보상을 수령했습니다.");
    }
}
