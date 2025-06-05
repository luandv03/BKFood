import { useEffect, useState } from "react";
import {
    FaClock,
    FaFilter,
    FaMoneyBillWave,
    FaRuler,
    FaStar,
    FaTimes,
    FaUsers,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import FoodRecommendation from "../components/FoodRecommendation";
import "./HomePage.css";

// Sample restaurant data with reviews added
const initialRestaurants = [
    {
        id: "1",
        name: "Phở Hà Nội",
        rating: 4.8,
        address: "123 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
        distance: "0.2",
        openingHours: "7 AM - 9 PM",
        price: "30,000 - 65,000₫",
        imageUrl:
            "https://images.unsplash.com/photo-1503764654157-72d979d9af2f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1174&q=80",
        isBusy: true,
        isRecommended: true,
        images: [
            "https://images.unsplash.com/photo-1503764654157-72d979d9af2f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1174&q=80",
            "https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
            "https://images.unsplash.com/photo-1576749872435-ff88a71c1ae2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
        ],
        about: "Được thành lập vào năm 2010, Phở Hà Nội phục vụ ẩm thực Việt Nam truyền thống cho khách hàng tại Hà Nội. Chuyên môn của chúng tôi là phở bò truyền thống được nấu với nước dùng đậm đà được ninh trong hơn 8 giờ với các loại thảo mộc và gia vị.",
        reviewCount: 128,
        hygieneRating: 4.5,
        seatingAvailability: "Tốt",
        featuredDishes: [
            {
                id: "1",
                name: "Phở Bò Đặc Biệt",
                price: "65,000₫",
                description:
                    "Phở bò đặc biệt với các loại thịt bò cao cấp và nước dùng đậm đà",
                imageUrl:
                    "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
                isPopular: true,
            },
            {
                id: "2",
                name: "Bún Chả",
                price: "55,000₫",
                description:
                    "Bún chả với thịt lợn nướng than hoa, ăn kèm với bún, rau sống và nước mắm chua ngọt",
                imageUrl:
                    "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
                isPopular: true,
            },
            {
                id: "3",
                name: "Gỏi Cuốn",
                price: "45,000₫",
                description:
                    "Gỏi cuốn tôm thịt, cuốn với rau xanh, giá, bún và ăn với nước mắm pha",
                imageUrl:
                    "https://images.unsplash.com/photo-1553701879-4aa576804f65?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            },
        ],
        reviews: [
            {
                id: 1,
                userName: "Nguyễn Văn A",
                userAvatar:
                    "https://schooler.sun-asterisk.com/storage/images/avatar/student/66fe0da9a5d64.",
                rating: 5,
                date: "20/05/2025",
                comment: "Món ăn rất ngon, phục vụ nhanh chóng!",
                images: [
                    "https://images.unsplash.com/photo-1503764654157-72d979d9af2f",
                    "https://images.unsplash.com/photo-1555126634-323283e090fa",
                ],
            },
            {
                id: 2,
                userName: "Trần Thị B",
                userAvatar:
                    "https://schooler.sun-asterisk.com/storage/images/avatar/student/62fe68d66953c.",
                rating: 4,
                date: "19/05/2025",
                comment: "Không gian quán đẹp, đồ ăn tạm ổn.",
            },
        ],
    },
    {
        id: "2",
        name: "Bún Chả Hương Liên",
        rating: 4.5,
        address: "24 Lê Văn Hưu, Hai Bà Trưng, Hà Nội",
        distance: "0.5",
        openingHours: "10 AM - 8 PM",
        price: "45,000 - 80,000₫",
        imageUrl:
            "https://images.unsplash.com/photo-1552611052-33e04de081de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        isBusy: false,
        isRecommended: false,
        images: [
            "https://images.unsplash.com/photo-1552611052-33e04de081de?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1570275239925-4af0aa93a0dc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        ],
        about: "Bún Chả Hương Liên nổi tiếng với món bún chả thơm ngon đậm đà. Nhà hàng trở nên nổi tiếng hơn sau khi đón tiếp cựu Tổng thống Obama vào năm 2016.",
        reviewCount: 156,
        hygieneRating: 4.3,
        seatingAvailability: "Tốt",
        featuredDishes: [
            {
                id: "1",
                name: "Bún Chả",
                price: "55,000₫",
                description:
                    "Bún chả truyền thống Hà Nội với thịt nướng than hoa",
                imageUrl:
                    "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
                isPopular: true,
            },
            {
                id: "2",
                name: "Nem Rán",
                price: "45,000₫",
                description: "Nem rán giòn thơm với nhân thịt và nấm",
                imageUrl:
                    "https://images.unsplash.com/photo-1514326005837-fb4791d25e03?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
                isPopular: true,
            },
        ],
        reviews: [
            {
                id: 1,
                userName: "Lê Văn C",
                userAvatar:
                    "https://schooler.sun-asterisk.com/storage/images/avatar/student/66fe0da9a5d64.",
                rating: 5,
                date: "15/05/2025",
                comment: "Bún chả ngon nhất Hà Nội, đúng vị truyền thống.",
            },
            {
                id: 2,
                userName: "Phạm Thị D",
                userAvatar:
                    "https://schooler.sun-asterisk.com/storage/images/avatar/student/62fe68d66953c.",
                rating: 4,
                date: "12/05/2025",
                comment:
                    "Quán đông khách, phải đợi hơi lâu nhưng đồ ăn rất ngon.",
                images: [
                    "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba",
                ],
            },
        ],
    },
    {
        id: "3",
        name: "Bánh Mì Bà Lan",
        rating: 4.6,
        address: "26 Lê Lợi, Quận 1, TP. Hồ Chí Minh",
        distance: "1.2",
        openingHours: "6 AM - 10 PM",
        price: "20,000 - 35,000₫",
        imageUrl:
            "https://lh3.googleusercontent.com/gps-cs-s/AC9h4npHQ5jGoPVDWWvsFg21Ww0f8HM7lfXKDzUxg8sukf_iVpy6IUYftj_0vQ4-MFKkcyZVBLSaXlb1JA0jzsdoYFxTT101x0WVHrO3R3oXUz0EoBAwwPSBaXdkF-HejCWbGUROf7EHgw=w103-h103-n-k-no",
        isBusy: false,
        isRecommended: true,
        images: [
            "https://lh3.googleusercontent.com/gps-cs-s/AC9h4npHQ5jGoPVDWWvsFg21Ww0f8HM7lfXKDzUxg8sukf_iVpy6IUYftj_0vQ4-MFKkcyZVBLSaXlb1JA0jzsdoYFxTT101x0WVHrO3R3oXUz0EoBAwwPSBaXdkF-HejCWbGUROf7EHgw=w103-h103-n-k-no",
            "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1590080877034-13d4bd327f0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
        ],
        about: "Ra đời từ năm 1985, Bánh Mì Bà Lan là một biểu tượng ẩm thực đường phố Sài Gòn. Với công thức nước sốt gia truyền và nguyên liệu tươi ngon, chúng tôi phục vụ hàng trăm ổ bánh mì mỗi ngày cho người dân địa phương và du khách.",
        reviewCount: 210,
        hygieneRating: 4.4,
        seatingAvailability: "Hạn chế",
        featuredDishes: [
            {
                id: "1",
                name: "Bánh Mì Thịt Nguội",
                price: "30,000₫",
                description:
                    "Bánh mì giòn thơm kẹp thịt nguội, dưa leo, pate và nước sốt đặc biệt",
                imageUrl:
                    "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
                isPopular: true,
            },
            {
                id: "2",
                name: "Bánh Mì Trứng Ốp La",
                price: "25,000₫",
                description:
                    "Ổ bánh mì truyền thống với trứng ốp la và pate nóng hổi",
                imageUrl:
                    "https://lh3.googleusercontent.com/gps-cs-s/AC9h4noq0Xv-qN6aIW0GjEOIVzoS9Y_WQy2-RdrYKzFRudvfG-uhSKnB9IV5a-EieT3Q3S7qmAbgo44mXuLbY4QJR-ZBBb-SbNbsm9vOPPhXOghZf9h4JMxLqlUdOMuJ-IuPog6YTDZ_wLdt6DUT=s680-w680-h510-rw",
            },
        ],
        reviews: [
            {
                id: 1,
                userName: "Ngô Thị E",
                userAvatar:
                    "https://schooler.sun-asterisk.com/storage/images/avatar/student/62fe68d66953c.",
                rating: 5,
                date: "10/05/2025",
                comment: "Bánh mì giòn rụm, nước sốt ngon tuyệt vời!",
                images: [
                    "https://images.unsplash.com/photo-1550547660-d9450f859349",
                    "https://lh3.googleusercontent.com/gps-cs-s/AC9h4noq0Xv-qN6aIW0GjEOIVzoS9Y_WQy2-RdrYKzFRudvfG-uhSKnB9IV5a-EieT3Q3S7qmAbgo44mXuLbY4QJR-ZBBb-SbNbsm9vOPPhXOghZf9h4JMxLqlUdOMuJ-IuPog6YTDZ_wLdt6DUT=s680-w680-h510-rw",
                ],
            },
            {
                id: 2,
                userName: "Phạm Văn F",
                userAvatar:
                    "https://schooler.sun-asterisk.com/storage/images/avatar/student/66fe0da9a5d64.",
                rating: 4,
                date: "08/05/2025",
                comment: "Ổ bánh hơi nhỏ nhưng vị ngon không chê vào đâu được.",
            },
        ],
    },
    {
        id: "4",
        name: "Cơm Tấm Sài Gòn",
        rating: 4.7,
        address: "45 Nguyễn Huệ, Quận 1, TP.HCM",
        distance: "0.3",
        openingHours: "6 AM - 10 PM",
        price: "35,000 - 70,000₫",
        imageUrl:
            "https://lh3.googleusercontent.com/gps-cs-s/AC9h4npzPophbFb41yNYfnqNrMgTYEp0qLb5fzV2bWVM-RnLITqmzDIva8kKiP97o9mVpvnMf2_es5XBt7z9s2_4SQkCszESJQtPG-7NQYyzRIIl-JGH5kYHlj-3BWhcL2CHWKvbRoud=w83-h83-n-k-no",
        isBusy: false,
        isRecommended: true,
        images: [
            "https://lh3.googleusercontent.com/gps-cs-s/AC9h4npzPophbFb41yNYfnqNrMgTYEp0qLb5fzV2bWVM-RnLITqmzDIva8kKiP97o9mVpvnMf2_es5XBt7z9s2_4SQkCszESJQtPG-7NQYyzRIIl-JGH5kYHlj-3BWhcL2CHWKvbRoud=w83-h83-n-k-no",
            "https://images.unsplash.com/photo-1625601171837-9f1372214b6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1571167111898-b8b17a16286b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        ],
        about: "Cơm Tấm Sài Gòn mang hương vị miền Nam đích thực với sườn nướng, bì, chả được chế biến theo công thức truyền thống. Không gian sạch sẽ, phục vụ nhanh nhẹn và thân thiện.",
        reviewCount: 102,
        hygieneRating: 4.6,
        seatingAvailability: "Tốt",
        featuredDishes: [
            {
                id: "1",
                name: "Cơm Tấm Sườn Bì Chả",
                price: "65,000₫",
                description:
                    "Cơm tấm ăn kèm sườn nướng, bì, chả và mỡ hành thơm ngon",
                imageUrl:
                    "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nppBQ7smxxkg14dD5jI7LJlRGnpfYEuIP4gOxsyuklnHgQXWoZDU158ORc_3EWjXIjbhnieu1hYTLrJJhdlVnlhUrAM-bRz0lTtSXkfFVu6R4rCRxlsvTSSu3mz6HGXWNviOvHy=w234-h157-n-k-no",
                isPopular: true,
            },
            {
                id: "2",
                name: "Trứng Ốp La",
                price: "10,000₫",
                description:
                    "Trứng ốp la lòng đào, ăn kèm với cơm tấm và nước mắm pha",
                imageUrl:
                    "https://lh3.googleusercontent.com/gps-cs-s/AC9h4npmcodtxz_FT3txOv4CwaepninHHtEEo6YM4wiCNxBCEjv590UdNLyJZq4bgmnDycLMYYgZ8G5ZNgZekwSlNsW3bSIIm0QAfpcZ3OCazdRNgZqX5BImstNLt7O9GpT7g_eb5A-9=s680-w680-h510-rw",
            },
        ],
        reviews: [
            {
                id: 1,
                userName: "Đỗ Minh Khoa",
                userAvatar:
                    "https://schooler.sun-asterisk.com/storage/images/avatar/student/66fe0da9a5d64.",
                rating: 5,
                date: "18/05/2025",
                comment: "Cơm mềm, sườn ướp đậm đà. Nước mắm tuyệt vời luôn!",
                images: [
                    "https://lh3.googleusercontent.com/gps-cs-s/AC9h4npmcodtxz_FT3txOv4CwaepninHHtEEo6YM4wiCNxBCEjv590UdNLyJZq4bgmnDycLMYYgZ8G5ZNgZekwSlNsW3bSIIm0QAfpcZ3OCazdRNgZqX5BImstNLt7O9GpT7g_eb5A-9=s680-w680-h510-rw",
                    "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrdId0Q24E2zJzQY47mUzNAVg52MUZqfPIL3gJprLOltZqCuykNwQwnu1VQ0lUBFenk1s8R951ud5eEnAlTAN3AHJe1WGIOFnFattRyPbYRfcgqcyDxCejRsd63_Ub-mKtnmc4e=s680-w680-h510-rw",
                ],
            },
            {
                id: 2,
                userName: "Ngô Thanh Hà",
                userAvatar:
                    "https://schooler.sun-asterisk.com/storage/images/avatar/student/62fe68d66953c.",
                rating: 4,
                date: "16/05/2025",
                comment: "Quán sạch sẽ, nhân viên nhiệt tình. Giá hợp lý.",
            },
        ],
    },
    {
        id: "5",
        name: "Phở Thìn Hà Nội",
        rating: 4.8,
        address: "13 Lò Đúc, Hai Bà Trưng, Hà Nội",
        distance: "0.7",
        openingHours: "5 AM - 9 PM",
        price: "40,000 - 70,000₫",
        imageUrl:
            "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrv-FAABsVjWLWP5xmotNgTXqyyA_xz6Q_SUG4LoaXQIsvtvZmAe7PvFWSHCYqjvlwhawpEP6SPaH0rB8qj9eDUE00t8bCyTwr2IwZrQtwRaCsGNJnzbFr_4ODL3nQqyv4Youw0rA=w103-h103-n-k-no",
        isBusy: true,
        isRecommended: true,
        images: [
            "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqtO2tytzHhjH8fT77l2EOAFs2BIK4TVlyWDIL9E_TSQlJSuxL-jEiusoFLWyMJP2uaBk6JcpctimAz14f-dep3Rt2LSJalCDYLXmmeSmowSnt7sU9xjFuXFVkxu71NBKAFPpGk9PGzy-2_=s680-w680-h510-rw",
            "https://images.unsplash.com/photo-1617196037301-1685b94f7e7e",
            "https://images.unsplash.com/photo-1612531380796-cc6908e230df",
        ],
        about: "Phở Thìn là thương hiệu lâu đời nổi tiếng với nước dùng béo ngậy, thơm mùi gừng và hành. Bát phở đầy đặn, thịt bò xào tái lăn hấp dẫn.",
        reviewCount: 234,
        hygieneRating: 4.7,
        seatingAvailability: "Trung bình",
        featuredDishes: [
            {
                id: "1",
                name: "Phở Bò Tái Lăn",
                price: "65,000₫",
                description:
                    "Phở bò xào tái với nước dùng đậm vị và hành phi thơm lừng",
                imageUrl:
                    "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqtO2tytzHhjH8fT77l2EOAFs2BIK4TVlyWDIL9E_TSQlJSuxL-jEiusoFLWyMJP2uaBk6JcpctimAz14f-dep3Rt2LSJalCDYLXmmeSmowSnt7sU9xjFuXFVkxu71NBKAFPpGk9PGzy-2_=s680-w680-h510-rw",
                isPopular: true,
            },
            {
                id: "2",
                name: "Trà Đá",
                price: "5,000₫",
                description:
                    "Trà đá miễn phí, mát lạnh và giải nhiệt tuyệt vời",
                imageUrl:
                    "https://lh3.googleusercontent.com/gps-cs-s/AC9h4np94vtlG6Ft2kge5Yc1Rt2GUUA_AmSqQdnLid0uGlQetzIbmeMOWUAugTh5BeJaaM3HcWpofPgjDtc7oFZU_RkupjrWyhD15jDfAXZNSAnbotjWwVLvG3stIR92-LnFkvXZmcVb=s680-w680-h510-rw",
            },
        ],
        reviews: [
            {
                id: 1,
                userName: "Trần Văn Long",
                userAvatar:
                    "https://schooler.sun-asterisk.com/storage/images/avatar/student/66e8eb0275a36.",
                rating: 5,
                date: "12/05/2025",
                comment:
                    "Phở ngon đỉnh, thịt mềm, nước dùng béo ngậy. Đúng chuẩn Hà Nội!",
                images: [
                    "https://lh3.googleusercontent.com/gps-cs-s/AC9h4np94vtlG6Ft2kge5Yc1Rt2GUUA_AmSqQdnLid0uGlQetzIbmeMOWUAugTh5BeJaaM3HcWpofPgjDtc7oFZU_RkupjrWyhD15jDfAXZNSAnbotjWwVLvG3stIR92-LnFkvXZmcVb=s680-w680-h510-rw",
                ],
            },
            {
                id: 2,
                userName: "Nguyễn Phương Linh",
                userAvatar:
                    "https://schooler.sun-asterisk.com/storage/images/avatar/student/66e42b6f95a99.",
                rating: 4,
                date: "10/05/2025",
                comment:
                    "Quán hơi đông nhưng đáng để thử. Hành và gừng thơm lắm!",
            },
        ],
    },
    {
        id: "6",
        name: "Mì Quảng Bà Mua",
        rating: 4.5,
        address: "95 Nguyễn Tri Phương, Đà Nẵng",
        distance: "1.1",
        openingHours: "6 AM - 10 PM",
        price: "30,000 - 60,000₫",
        imageUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMwlQhggjardbWDqYUQxTno37kEDS1TVpt1Q&s",
        isBusy: false,
        isRecommended: false,
        images: [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMwlQhggjardbWDqYUQxTno37kEDS1TVpt1Q&s",
            "https://images.unsplash.com/photo-1589100730005-cd1b8cc97c10",
            "https://images.unsplash.com/photo-1572635196237-14b1f228f19b",
        ],
        about: "Mì Quảng Bà Mua là địa chỉ quen thuộc với người dân Đà Nẵng. Món mì đậm đà, topping đa dạng từ tôm, thịt, trứng đến bánh tráng giòn tan.",
        reviewCount: 185,
        hygieneRating: 4.2,
        seatingAvailability: "Tốt",
        featuredDishes: [
            {
                id: "1",
                name: "Mì Quảng Tôm Thịt",
                price: "50,000₫",
                description:
                    "Mì Quảng sợi to, ăn cùng nước sốt đậm đà, thịt heo và tôm rim",
                imageUrl:
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS141U-grAwvB9NNhUphmOvKTajg7oVF9cQaw&s",
                isPopular: true,
            },
            {
                id: "2",
                name: "Ram Cuốn",
                price: "20,000₫",
                description:
                    "Ram nhỏ giòn tan, cuốn bánh tráng và rau sống tươi ngon",
                imageUrl:
                    "https://cdn.khamphadanang.vn/wp-content/uploads/2024/11/mi-quang-ba-mua1.jpg",
            },
        ],
        reviews: [
            {
                id: 1,
                userName: "Lê Văn Tâm",
                userAvatar:
                    "https://schooler.sun-asterisk.com/storage/images/avatar/student/66e307d8b8d19.",
                rating: 5,
                date: "08/05/2025",
                comment:
                    "Sợi mì dai ngon, nước sốt mặn mà, ram cuốn ăn kèm quá hợp!",
                images: [
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS141U-grAwvB9NNhUphmOvKTajg7oVF9cQaw&s",
                ],
            },
            {
                id: 2,
                userName: "Phạm Mỹ Duyên",
                userAvatar:
                    "https://schooler.sun-asterisk.com/storage/images/avatar/student/66e2b19a5693c.",
                rating: 4,
                date: "05/05/2025",
                comment:
                    "Món ngon, trình bày đẹp. Chỉ hơi chờ lâu vào giờ cao điểm.",
            },
        ],
    },

    // ...add similar detailed information for remaining restaurants...
];

// Filter option types
const filterOptions = {
    ALL: "Tất cả",
    NEAREST: "Gần nhất",
    HIGHEST_RATED: "Yêu thích nhất",
    RECOMMENDED: "Gợi ý",
};

const HomePage = ({ showSuggestion }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [restaurants, setRestaurants] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState(filterOptions.ALL);
    const [showRecommendation, setShowRecommendation] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showFilterPopup, setShowFilterPopup] = useState(false);

    // States for filter options
    const [radiusFilter, setRadiusFilter] = useState("Không giới hạn");
    const [priceFilter, setPriceFilter] = useState("Tất cả");
    const [ratingFilter, setRatingFilter] = useState("Tất cả");

    // States to toggle dropdown visibility
    const [showRadiusDropdown, setShowRadiusDropdown] = useState(false);
    const [showPriceDropdown, setShowPriceDropdown] = useState(false);
    const [showRatingDropdown, setShowRatingDropdown] = useState(false);

    // Filter options data
    const radiusOptions = [
        "< 100m",
        "< 200m",
        "< 500m",
        "< 1km",
        "< 2km",
        "< 5km",
        "Không giới hạn",
    ];
    const priceOptions = [
        "< 30.000đ",
        "30.000đ - 50.000đ",
        "50.000đ - 100.000đ",
        "> 100.000đ",
        "Tất cả",
    ];
    const ratingOptions = ["5 sao", "4+ sao", "3+ sao", "Tất cả"];

    useEffect(() => {
        // Try to load from localStorage first
        const storedRestaurants = localStorage.getItem("restaurants");

        if (storedRestaurants) {
            // Use data from localStorage if available
            setRestaurants(JSON.parse(storedRestaurants));
        } else {
            // Otherwise use initial data and store in localStorage
            setRestaurants(initialRestaurants);
            localStorage.setItem(
                "restaurants",
                JSON.stringify(initialRestaurants)
            );
        }

        // Simulate loading delay
        const timer = setTimeout(() => {
            setIsLoading(false);
            setShowRecommendation(true);
        }, 1500);

        // Add scroll listener
        window.addEventListener("scroll", handleScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Update localStorage when restaurants change (for reviews)
    useEffect(() => {
        if (restaurants.length > 0) {
            localStorage.setItem("restaurants", JSON.stringify(restaurants));
        }
    }, [restaurants]);

    // Check if reviews were updated from ExplorePage
    useEffect(() => {
        if (location.state && location.state.updatedRestaurant) {
            const { updatedRestaurant } = location.state;

            setRestaurants((prev) =>
                prev.map((restaurant) =>
                    restaurant.id === updatedRestaurant.id
                        ? updatedRestaurant
                        : restaurant
                )
            );

            // Clear the navigation state
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
    };

    // Hàm để đóng tất cả dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showFilterPopup) {
                // Kiểm tra có click vào dropdown hay không
                const isClickOnDropdown =
                    event.target.closest(".dropdown-menu") ||
                    event.target.closest(".filter-option");

                if (!isClickOnDropdown) {
                    setShowRadiusDropdown(false);
                    setShowPriceDropdown(false);
                    setShowRatingDropdown(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showFilterPopup]);

    // Filter restaurants based on active filter
    const getFilteredRestaurants = () => {
        let filtered = [...restaurants];

        // Apply search filter if query exists
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter(
                (restaurant) =>
                    restaurant.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    restaurant.address
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }

        // Apply distance/radius filter
        if (radiusFilter !== "Không giới hạn") {
            const maxDistance = parseFloat(
                radiusFilter.replace("< ", "").replace("km", "")
            );
            filtered = filtered.filter(
                (restaurant) => parseFloat(restaurant.distance) <= maxDistance
            );
        }

        // Apply price filter
        if (priceFilter === "< 30.000đ") {
            filtered = filtered.filter((restaurant) => {
                const minPrice = parseFloat(
                    restaurant.price
                        .split(" - ")[0]
                        .replace(",", "")
                        .replace(".", "")
                );
                return minPrice < 30000;
            });
        } else if (priceFilter === "30.000đ - 50.000đ") {
            filtered = filtered.filter((restaurant) => {
                const prices = restaurant.price.split(" - ");
                const minPrice = parseFloat(
                    prices[0].replace(",", "").replace(".", "")
                );
                const maxPrice = parseFloat(
                    prices[1].replace("₫", "").replace(",", "").replace(".", "")
                );
                return minPrice >= 30000 && maxPrice <= 50000;
            });
        } else if (priceFilter === "50.000đ - 100.000đ") {
            filtered = filtered.filter((restaurant) => {
                const prices = restaurant.price.split(" - ");
                const minPrice = parseFloat(
                    prices[0].replace(",", "").replace(".", "")
                );
                const maxPrice = parseFloat(
                    prices[1].replace("₫", "").replace(",", "").replace(".", "")
                );
                return minPrice >= 50000 && maxPrice <= 100000;
            });
        } else if (priceFilter === "> 100.000đ") {
            filtered = filtered.filter((restaurant) => {
                const maxPrice = parseFloat(
                    restaurant.price
                        .split(" - ")[1]
                        .replace("₫", "")
                        .replace(",", "")
                        .replace(".", "")
                );
                return maxPrice > 100000;
            });
        }

        // Apply rating filter
        if (ratingFilter === "5 sao") {
            filtered = filtered.filter(
                (restaurant) => restaurant.rating === 5.0
            );
        } else if (ratingFilter === "4+ sao") {
            filtered = filtered.filter(
                (restaurant) => restaurant.rating >= 4.0
            );
        } else if (ratingFilter === "3+ sao") {
            filtered = filtered.filter(
                (restaurant) => restaurant.rating >= 3.0
            );
        }

        // Apply additional filters
        switch (activeFilter) {
            case filterOptions.NEAREST:
                filtered.sort(
                    (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
                );
                break;
            case filterOptions.HIGHEST_RATED:
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case filterOptions.RECOMMENDED:
                filtered = filtered.filter(
                    (restaurant) => restaurant.isRecommended
                );
                // Optionally, sort recommended items by some criteria, e.g., rating
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // Default sorting can be based on some relevance score or just keep original order
                break;
        }

        return filtered;
    };

    const handleRestaurantPress = (restaurant) => {
        console.log(`Selected restaurant: ${restaurant.name}`);
        // Navigate to the restaurant detail screen with restaurant ID
        navigate(`/explore/${restaurant.id}`, {
            state: { restaurantId: restaurant.id },
        });
    };

    const handleRecommendationClose = () => {
        setShowRecommendation(false);
        // Update session storage to remember that the recommendation has been shown
        sessionStorage.setItem("foodSuggestionShown", "false");
    };

    const toggleFilterPopup = () => {
        setShowFilterPopup((prevState) => !prevState);
        // Reset dropdown visibilities when opening/closing popup
        setShowRadiusDropdown(false);
        setShowPriceDropdown(false);
        setShowRatingDropdown(false);
    };

    // Handlers for filter selections
    const handleRadiusSelect = (radius) => {
        setRadiusFilter(radius);
        setShowRadiusDropdown(false);
    };

    const handlePriceSelect = (price) => {
        setPriceFilter(price);
        setShowPriceDropdown(false);
    };

    const handleRatingSelect = (rating) => {
        setRatingFilter(rating);
        setShowRatingDropdown(false);
    };

    // Toggle dropdown visibility
    const toggleRadiusDropdown = () => {
        setShowRadiusDropdown(!showRadiusDropdown);
        setShowPriceDropdown(false);
        setShowRatingDropdown(false);
    };

    const togglePriceDropdown = () => {
        setShowPriceDropdown(!showPriceDropdown);
        setShowRadiusDropdown(false);
        setShowRatingDropdown(false);
    };

    const toggleRatingDropdown = () => {
        setShowRatingDropdown(!showRatingDropdown);
        setShowRadiusDropdown(false);
        setShowPriceDropdown(false);
    };

    const applyFilters = () => {
        // Đóng popup filter sau khi áp dụng
        toggleFilterPopup();
    };

    return (
        <div className="homepage">
            {/* Sticky header */}{" "}
            <header className={`home-header ${isScrolled ? "scrolled" : ""}`}>
                <h1 className="home-title">BK Food</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Phở..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        className="search-button"
                        onClick={toggleFilterPopup}
                    >
                        <span className="search-icon">
                            <FaFilter />
                            {/* <FaSearch /> */}
                        </span>
                    </button>
                </div>
            </header>
            {/* Filter Popup */}
            {showFilterPopup && (
                <div
                    className="filter-popup-overlay"
                    onClick={toggleFilterPopup}
                >
                    <div
                        className="filter-popup"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="filter-popup-header">
                            <h3>Bộ lọc</h3>
                            <button
                                className="filter-close-button"
                                onClick={toggleFilterPopup}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="filter-section">
                            <h4>Bán kính</h4>
                            <div
                                className="filter-option"
                                onClick={toggleRadiusDropdown}
                            >
                                <span>{radiusFilter}</span>
                                <span className="arrow-icon">▼</span>
                            </div>
                            {showRadiusDropdown && (
                                <div className="dropdown-menu">
                                    {radiusOptions.map((option) => (
                                        <div
                                            key={option}
                                            className={`dropdown-item ${
                                                radiusFilter === option
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleRadiusSelect(option)
                                            }
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="filter-section">
                            <h4>Giá cả</h4>
                            <div
                                className="filter-option"
                                onClick={togglePriceDropdown}
                            >
                                <span>{priceFilter}</span>
                                <span className="arrow-icon">▼</span>
                            </div>
                            {showPriceDropdown && (
                                <div className="dropdown-menu">
                                    {priceOptions.map((option) => (
                                        <div
                                            key={option}
                                            className={`dropdown-item ${
                                                priceFilter === option
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handlePriceSelect(option)
                                            }
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="filter-section">
                            <h4>Đánh giá</h4>
                            <div
                                className="filter-option"
                                onClick={toggleRatingDropdown}
                            >
                                <span>{ratingFilter}</span>
                                <span className="arrow-icon">▼</span>
                            </div>
                            {showRatingDropdown && (
                                <div className="dropdown-menu">
                                    {ratingOptions.map((option) => (
                                        <div
                                            key={option}
                                            className={`dropdown-item ${
                                                ratingFilter === option
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleRatingSelect(option)
                                            }
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* <button
                            className="filter-apply-button"
                            onClick={applyFilters}
                        >
                            Áp dụng
                        </button> */}
                    </div>
                </div>
            )}
            {/* Main content */}
            <main className="home-content">
                {isLoading ? (
                    <div className="loading-container">
                        <div className="loader"></div>
                        <p>Đang tải danh sách nhà hàng...</p>
                    </div>
                ) : (
                    <>
                        {" "}
                        {/* Filter options */}
                        <div className="filter-options">
                            <button
                                className={`filter-button ${
                                    activeFilter === filterOptions.ALL
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    setActiveFilter(filterOptions.ALL)
                                }
                            >
                                {filterOptions.ALL}
                            </button>
                            <button
                                className={`filter-button ${
                                    activeFilter === filterOptions.NEAREST
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    setActiveFilter(filterOptions.NEAREST)
                                }
                            >
                                {filterOptions.NEAREST}
                            </button>
                            <button
                                className={`filter-button ${
                                    activeFilter === filterOptions.HIGHEST_RATED
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    setActiveFilter(filterOptions.HIGHEST_RATED)
                                }
                            >
                                {filterOptions.HIGHEST_RATED}
                            </button>
                            <button
                                className={`filter-button ${
                                    activeFilter === filterOptions.RECOMMENDED
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    setActiveFilter(filterOptions.RECOMMENDED)
                                }
                            >
                                {filterOptions.RECOMMENDED}
                            </button>
                        </div>
                        {/* Food recommendation popup */}
                        {JSON.parse(
                            sessionStorage.getItem("foodSuggestionShown")
                        ) &&
                            showRecommendation && (
                                <FoodRecommendation
                                    onClose={handleRecommendationClose}
                                />
                            )}
                        {/* Restaurant list */}
                        <div className="home-restaurant-list">
                            {getFilteredRestaurants().map((restaurant) => (
                                <div
                                    key={restaurant.id}
                                    className="home-restaurant-card"
                                    onClick={() =>
                                        handleRestaurantPress(restaurant)
                                    }
                                >
                                    <div className="home-restaurant-image-container">
                                        {" "}
                                        <img
                                            src={restaurant.imageUrl}
                                            className="home-restaurant-image"
                                            alt={restaurant.name}
                                        />
                                        {restaurant.isBusy && (
                                            <div className="busy-badge">
                                                <FaUsers />
                                                <span>Đông</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="home-restaurant-info">
                                        <div className="home-restaurant-header">
                                            <h3 className="home-restaurant-name">
                                                {restaurant.name}
                                            </h3>
                                        </div>
                                        <div className="rating-container">
                                            <span className="rating-text">
                                                {restaurant.rating}
                                            </span>
                                            <FaStar className="star-icon" />
                                        </div>

                                        <p className="home-restaurant-address">
                                            {restaurant.address}
                                        </p>

                                        <div className="home-restaurant-details">
                                            <div className="detail-item">
                                                <FaClock className="detail-icon" />
                                                <span className="detail-text">
                                                    {restaurant.openingHours}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <FaRuler className="detail-icon" />
                                                <span className="detail-text">
                                                    {restaurant.distance} km
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <FaMoneyBillWave className="detail-icon" />
                                                <span className="detail-text">
                                                    {restaurant.price}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default HomePage;
