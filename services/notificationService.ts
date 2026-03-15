import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationService = {
  requestPermissions: async (): Promise<boolean> => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === "granted";
    } catch {
      return false;
    }
  },

  showBookmarkNotification: async (): Promise<void> => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Waah! 5 Courses Bookmark ho gaye! 🎉",
          body: "Tumne 5 courses bookmark kar liye. Padhna shuru karo!",
        },
        trigger: null,
      });
    } catch (e) {}
  },

  scheduleReminderNotification: async (): Promise<void> => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Seekhna mat bhoolna! 📚",
          body: "Kal se app nahi khola. Chalo aaj thoda padhte hain!",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 86400,
          repeats: false,
        },
      });
    } catch (e) {}
  },

  cancelAllNotifications: async (): Promise<void> => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (e) {}
  },
};