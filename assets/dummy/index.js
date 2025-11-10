export const notificationsData = [
  {
    id: "1",
    type: "Reimbursement",
    status: "PAID",
    content: [
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
    created_at: "2025-11-10T09:15:00Z",
    is_read: true,
  },
  {
    id: "2",
    type: "Overtime",
    status: "REJECTED",
    content: [
      {
        type: "text",
        content: 'Your submission "description" has been ',
      },
      { type: "bold", content: "rejected" },
      { type: "text", content: ", please click for details." },
    ],
    created_at: "2025-11-09T15:30:00Z",
    is_read: true,
  },
  {
    id: "3",
    type: "Reimbursement",
    status: "PROCESSING",
    content: [
      { type: "text", content: "Your submission will be " },
      { type: "bold", content: "processed" },
      {
        type: "text",
        content: " according to the Reimbursement schedule. Please wait",
      },
    ],
    created_at: "2025-10-08T11:00:00Z",
    is_read: false,
  },
  {
    id: "4",
    type: "Sickness",
    status: "APPROVED",
    content: [
      { type: "text", content: "Your submission has been " },
      { type: "bold", content: "approved" },
      { type: "text", content: " by the Superior." },
    ],
    created_at: "2025-10-05T17:05:00Z",
    is_read: false,
  },
  {
    id: "5",
    type: "Sickness",
    status: "REJECTED",
    content: [
      { type: "text", content: "Your submission has been " },
      { type: "bold", content: "rejected" },
      {
        type: "text",
        content: ", please confirm with your Superior.",
      },
    ],
    created_at: "2025-10-05T16:00:00Z",
    is_read: true,
  },
  {
    id: "6",
    type: "Sickness",
    status: "PROCESSING",
    content: [
      { type: "text", content: "Your submission is " },
      { type: "bold", content: "being reviewed" },
      {
        type: "text",
        content: " by the Superior for the approval process, please wait.",
      },
    ],
    created_at: "2025-10-05T15:30:00Z",
    is_read: false,
  },
  {
    id: "7",
    type: "Reimbursement",
    status: "PAID",
    content: [
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
    is_read: false,
  },
  {
    id: "8",
    type: "Reimbursement",
    status: "REJECTED",
    content: [
      {
        type: "text",
        content: 'Your submission "description" has been ',
      },
      { type: "bold", content: "rejected" },
      { type: "text", content: ", please click for details." },
    ],
    created_at: "2025-11-08T15:30:00Z",
    is_read: true,
  },
  {
    id: "9",
    type: "Reimbursement",
    status: "PROCESSING",
    content: [
      { type: "text", content: "Your submission will be " },
      { type: "bold", content: "processed" },
      {
        type: "text",
        content: " according to the Reimbursement schedule. Please wait",
      },
    ],
    created_at: "2025-10-06T11:00:00Z",
    is_read: true,
  },
  {
    id: "10",
    type: "Overtime",
    status: "APPROVED",
    content: [
      { type: "text", content: "Your submission has been " },
      { type: "bold", content: "approved" },
      { type: "text", content: " by the Superior." },
    ],
    created_at: "2025-10-05T17:05:00Z",
    is_read: true,
  },
  {
    id: "11",
    type: "Sickness",
    status: "REJECTED",
    content: [
      { type: "text", content: "Your submission has been " },
      { type: "bold", content: "rejected" },
      {
        type: "text",
        content: ", please confirm with your Superior.",
      },
    ],
    created_at: "2025-10-05T16:00:00Z",
    is_read: false,
  },
  {
    id: "12",
    type: "Overtime",
    status: "PROCESSING",
    content: [
      { type: "text", content: "Your submission is " },
      { type: "bold", content: "being reviewed" },
      {
        type: "text",
        content: " by the Superior for the approval process, please wait.",
      },
    ],
    created_at: "2025-10-05T15:30:00Z",
    is_read: true,
  },
];

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
      avatar: "https://testingbot.com/free-online-tools/random-avatar/80?img=1",
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
      avatar: "https://testingbot.com/free-online-tools/random-avatar/80?img=2",
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
      avatar: "https://testingbot.com/free-online-tools/random-avatar/80?img=3",
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
      avatar: "https://testingbot.com/free-online-tools/random-avatar/80?img=4",
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

export const rolesData = {
  Building: [
    {
      id: 14,
      name: "Create",
      html_id: "building.create",
    },
    {
      id: 16,
      name: "Delete",
      html_id: "building.delete",
    },
    {
      id: 15,
      name: "Edit",
      html_id: "building.edit",
    },
    {
      id: 13,
      name: "Index",
      html_id: "building.index",
    },
  ],
  Dashboard: [
    {
      id: 33,
      name: "Index",
      html_id: "dashboard.index",
    },
  ],
  Energy: [
    {
      id: 18,
      name: "Create",
      html_id: "energy.create",
    },
    {
      id: 20,
      name: "Delete",
      html_id: "energy.delete",
    },
    {
      id: 19,
      name: "Edit",
      html_id: "energy.edit",
    },
  ],
};
