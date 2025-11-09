export const notificationsData = {
  notifications: [
    {
      id: "notif_101",
      type: "REIMBURSEMENT",
      status: "PAID",
      message_content: [
        {
          type: "text",
          content: 'Your submission "Lorem ipsum dolor..." has been ',
        },
        { type: "bold", content: "paid" },
        {
          type: "text",
          content: ", please check your BRIMO application, Thankyou",
        },
      ],
      created_at: "2025-11-09T09:15:00Z",
    },
    {
      id: "notif_102",
      type: "REIMBURSEMENT",
      status: "REJECTED",
      message_content: [
        {
          type: "text",
          content: 'Your submission "description" has been ',
        },
        { type: "bold", content: "rejected" },
        { type: "text", content: ", please click for details." },
      ],
      created_at: "2025-11-08T15:30:00Z",
    },
    {
      id: "notif_103",
      type: "REIMBURSEMENT",
      status: "PROCESSING",
      message_content: [
        { type: "text", content: "Your submission will be " },
        { type: "bold", content: "processed" },
        {
          type: "text",
          content: " according to the reimbursement schedule. Please wait",
        },
      ],
      created_at: "2022-10-06T11:00:00Z",
    },
    {
      id: "notif_104",
      type: "SICKNESS",
      status: "APPROVED",
      message_content: [
        { type: "text", content: "Your submission has been " },
        { type: "bold", content: "approved" },
        { type: "text", content: " by the Superior." },
      ],
      created_at: "2022-10-05T17:05:00Z",
    },
    {
      id: "notif_105",
      type: "SICKNESS",
      status: "REJECTED",
      message_content: [
        { type: "text", content: "Your submission has been " },
        { type: "bold", content: "rejected" },
        {
          type: "text",
          content: ", please confirm with your Superior.",
        },
      ],
      created_at: "2022-10-05T16:00:00Z",
    },
    {
      id: "notif_106",
      type: "SICKNESS",
      status: "PROCESSING",
      message_content: [
        { type: "text", content: "Your submission is " },
        { type: "bold", content: "being reviewed" },
        {
          type: "text",
          content: " by the Superior for the approval process, please wait.",
        },
      ],
      created_at: "2022-10-05T15:30:00Z",
    },
  ],
};

export const onlineData = {
  users: [
    {
      user_id: "1",
      name: "Jepri",
      avatar: "https://avatar.iran.liara.run/public",
      location: "Sahid",
    },
    {
      user_id: "2",
      name: "Zasa",
      avatar: "https://avatar.iran.liara.run/public/girl",
      location: "BSD",
    },
    {
      user_id: "3",
      name: "Sam",
      avatar: "https://avatar.iran.liara.run/public",
      location: "BSD",
    },
    {
      user_id: "4",
      name: "Aldo",
      avatar: "https://avatar.iran.liara.run/public/girl",
      location: "Sahid",
    },
    {
      user_id: "5",
      name: "Erwin",
      avatar: "https://avatar.iran.liara.run/public",
      location: "Sahid",
    },
    {
      user_id: "6",
      name: "Arye",
      avatar: "https://avatar.iran.liara.run/public/girl",
      location: "BSD",
    },
    {
      user_id: "7",
      name: "Risya",
      avatar: "https://avatar.iran.liara.run/public",
      location: "BSD",
    },
    {
      user_id: "8",
      name: "Nesha",
      avatar: "https://avatar.iran.liara.run/public/girl",
      location: "WFA",
    },
  ],
  more_count: 10,
};

export const newsData = [
  {
    id: "news_002",
    user: {
      name: "Ana Rismawati",
      avatar: "https://avatar.iran.liara.run/public",
    },
    date: "2025-05-01T02:00:00Z",
    content: [
      "Kalimat 1 - Proyek A telah disetujui klien.",
      "Kalimat 2 - Rapat tim dipindahkan ke jam 2 siang.",
      "Kalimat 3 - Jangan lupa update timesheet mingguan.",
      "Kalimat 4 - Selamat bekerja!",
    ],
  },
  {
    id: "news_003",
    user: {
      name: "Citra Lestari",
      avatar: "https://avatar.iran.liara.run/public",
    },
    date: "2025-05-12T02:00:00Z",
    content: [
      "Kalimat 1 - Server akan maintenance pukul 17.00 WIB.",
      "Kalimat 2 - Selamat datang untuk karyawan baru, Dodi.",
      "Kalimat 3 - Perbaikan bug untuk login telah selesai.",
      "Kalimat 4 - Selamat bekerja!",
    ],
  },
  {
    id: "news_004",
    user: {
      name: "Rizky Pratama",
      avatar: "https://avatar.iran.liara.run/public",
    },
    date: "2025-05-11T02:00:00Z",
    content: [
      "Kalimat 1 - Update modul 'Reporting' telah rilis.",
      "Kalimat 2 - Harap perbarui aplikasi Anda.",
      "Kalimat 3 - Perbaikan bug untuk login telah selesai.",
      "Kalimat 4 - Selamat bekerja!",
    ],
  },
];

export const profileData = {
  name: "Tabay",
  position: "UI/UX Designer",
  join_date: "2025-01-01T02:00:00Z",
  location: "Kantor Sahid",
  activity: {
    check_in: "2025-09-09T02:00:00Z",
    check_out: "",
  },
};
