export const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return;
    }

    if (Notification.permission !== "granted") {
        await Notification.requestPermission();
    }
};

export const showNotification = (title: string, body: string, icon?: string) => {
    if (Notification.permission === "granted") {
        new Notification(title, {
            body,
            icon: icon || '/favicon.ico',
        });
    }
};
