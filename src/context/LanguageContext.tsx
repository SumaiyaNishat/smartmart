/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";

export type Language = "en" | "bn";

export interface LocalizedProduct {
  name: string;
  description: string;
  category: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatNumber: (num: number | string) => string;
  formatPrice: (amount: number) => string;
  getLocalizedProduct: (product: any) => LocalizedProduct;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

const banglaDigits: Record<string, string> = {
  "0": "০",
  "1": "১",
  "2": "২",
  "3": "৩",
  "4": "৪",
  "5": "৫",
  "6": "৬",
  "7": "৭",
  "8": "৮",
  "9": "৯",
};

const categoryTranslationMap: Record<string, { en: string; bn: string }> = {
  All: { en: "All", bn: "সব" },
  Electronics: { en: "Electronics", bn: "ইলেকট্রনিক্স" },
  Gadgets: { en: "Gadgets", bn: "গ্যাজেটস" },
  Accessories: { en: "Accessories", bn: "এক্সেসরিজ" },
  "Smart Home": { en: "Smart Home", bn: "স্মার্ট হোম" },
};

const dictionary = {
  en: {
    // Navigation & Header
    logo: "SmartMart",
    tagline: "Everything You Need, Delivered Fast.",
    home: "Home",
    products: "Products",
    cart: "Cart",
    login: "Login",
    register: "Register",
    logout: "Logout",
    dashboard: "Dashboard",
    adminPanel: "Admin Panel",
    searchPlaceholder: "Search products...",
    searchBtn: "Search",

    // Hero & Stats
    heroTitle: "The ultimate product with pleasure",
    heroDesc: "Let your product do the magic care for you. Change the quality of your personality by changing your appearance. Everything reflects your character and we're taking care of it.",
    shopNow: "Shop Now",
    explore: "Explore Products",
    statProducts: "1000+ Products",
    statCustomers: "5000+ Happy Customers",
    statDelivery: "Free Delivery",
    statSupport: "24/7 Support",

    // Products Section
    productsHeading: "Featured Products",
    productsSubheading: "Discover precision-engineered products, curated technology, and official store guarantees.",
    industrialMarketplace: "Industrial Marketplace",
    buyNow: "Buy Now",
    addToCart: "Add to Cart",
    added: "Added",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    onlyLeft: "Only {count} Left",
    off: "OFF",
    freeExpressDelivery: "Free 24h Express Delivery",
    clearFilters: "Clear Filters",
    noProductsFound: "No Products Found",
    noProductsDesc: "We couldn't find any items matching your criteria.",
    viewDetails: "View Details",

    // Categories
    catAll: "All",
    catElectronics: "Electronics",
    catGadgets: "Gadgets",
    catAccessories: "Accessories",
    catSmartHome: "Smart Home",

    // Product Details
    specifications: "Specifications",
    warranty: "Official Warranty",
    quantity: "Quantity",
    rating: "Rating",
    reviews: "Reviews",
    share: "Share",
    relatedProducts: "Related Products",
    recentlyViewed: "Recently Viewed Products",
    customerReviews: "Customer Reviews & Ratings",
    backToProducts: "Back to Products",
    inStockQuantity: "{count} items left in stock",
    highlightsTitle: "Product Highlights & Guarantees",
    premiumQuality: "100% Genuine & Premium Quality",
    officialWarranty: "Official Brand Warranty Included",
    fastNationwideDelivery: "Fast 24-48h Express Shipping",
    riskFreeCod: "Risk-Free Cash on Delivery",
    easyReturns: "7-Day Easy Return Policy",
    writeReview: "Write a Review",
    verifiedPurchase: "Verified Buyer",
    skuLabel: "SKU",
    brandLabel: "Brand",
    officialBrand: "SmartMart Official Store",
    outOfStockTitle: "Currently Out of Stock",
    outOfStockDesc: "This product is currently out of stock. Check back soon!",
    shareProduct: "Share Product",
    linkCopied: "Link copied to clipboard!",
    zoomHint: "Hover image to zoom, click for lightbox preview",
    productDescription: "Product Description",

    // Cart Page
    shoppingCart: "Shopping Cart",
    cartEmpty: "Your Cart is Empty",
    cartEmptyDesc: "Looks like you haven't added any products to your cart yet.",
    continueShopping: "Continue Shopping",
    subtotal: "Subtotal",
    shipping: "Delivery Charge",
    grandTotal: "Grand Total",
    proceedToCheckout: "Proceed to Checkout",
    remove: "Remove",
    itemCount: "{count} item(s)",

    // Checkout Page
    checkout: "Checkout",
    checkoutTitle: "Checkout & Order Details",
    billingDetails: "Delivery Information",
    fullName: "Full Name",
    emailAddress: "Email Address",
    phoneNumber: "Phone Number",
    deliveryAddress: "Full Shipping Address",
    district: "District",
    thana: "Thana / Upazila",
    paymentMethod: "Payment Method",
    cashOnDelivery: "Cash on Delivery",
    onlinePayment: "Online Payment",
    placeOrder: "Place Order Now",
    orderSummary: "Order Summary",
    orderSuccess: "Order Placed Successfully!",

    // Extended Checkout & Customer Form
    secureCheckout: "100% Secure Checkout",
    orderConfirmation: "Order Confirmation",
    enterDeliveryInfo: "Please enter your delivery information to complete the order",
    fastDelivery: "Fast Delivery",
    yourInfoAddress: "Your Information & Address",
    customerNameLabel: "Full Name *",
    customerNamePlaceholder: "Enter your full name",
    customerNameHelper: "This name will be printed on the delivery package label",
    altPhoneLabel: "Alternative Mobile (Optional)",
    altPhonePlaceholder: "Alternative phone number",
    altPhoneHelper: "Backup contact for emergency delivery issues",
    postalCodeLabel: "Postal Code (Optional)",
    postalCodePlaceholder: "e.g. 1205",
    districtLabel: "District *",
    districtPlaceholder: "e.g. Dhaka, Chittagong",
    thanaLabel: "Upazila / Thana *",
    thanaPlaceholder: "e.g. Dhanmondi, Gulshan",
    addressLabel: "Full Address *",
    addressPlaceholder: "House no, road no, area or village...",
    addressHelper: "Provide clear details so courier delivery agents can find your address easily",
    orderNoteLabel: "Order Note (Optional)",
    orderNotePlaceholder: "Any special instructions for delivery",
    placeOrderBtn: "Confirm Order ({total})",
    processingOrder: "Processing Order...",
    productInfo: "Product Information",
    estimatedDelivery: "🚀 Estimated Delivery: Within 2 - 4 business days",
    originalSubtotal: "Original Price (Subtotal)",
    discountSavings: "Discount Savings",
    freeDelivery: "Free Delivery",
    totalPayable: "Total Payable",
    codGuaranteeTitle: "100% Risk-Free Cash on Delivery",
    codGuaranteeDesc: "Pay after receiving and verifying your product.",
    backToPrevious: "Go Back",
    orderSuccessTitle: "Order Placed Successfully!",
    orderSuccessDesc: "Thank you. Our representative will contact you via phone call shortly.",
    trustSecureCheckout: "100% Secure Checkout",
    trustCashOnDelivery: "Cash on Delivery",
    trustFastDelivery: "Fast 2-4 Day Delivery",
    trustEasyReturns: "7-Day Easy Return",
    productNotFound: "Product Not Found",
    productNotFoundDesc: "Please select a product from the shop page to complete your order.",
    cartEmptyTitle: "Your Cart is Empty",
    cartEmptyDescription: "You haven't added any products to your cart to checkout.",

    // Form Validation Messages
    valName: "Please enter your full name (at least 2 characters)",
    valPhone: "Please enter a valid 11-digit mobile number (e.g. 017XXXXXXXX)",
    valEmail: "Please enter a valid email address",
    valAddress: "Please enter your complete address",
    valThana: "Please enter your upazila or thana",
    valDistrict: "Please enter your district name",
    valNoProductSelected: "No product selected.",
    valOrderFailed: "Failed to place order. Please try again.",

    // Toasts & Alerts
    cartEmptyToast: "Your cart is empty",
    itemAddedToast: "Item added to cart",
    itemRemovedToast: "Item removed from cart",
    loginSuccessToast: "Logged in successfully!",
    logoutSuccessToast: "Logged out successfully",
    accessDeniedAdmin: "Access denied. Admin role required.",
    loginToAccessDashboard: "Please login to access the admin dashboard.",

    // Auth Pages (Login & Register)
    welcomeBack: "Welcome Back",
    loginTitle: "Welcome Back",
    loginSubtitle: "Sign in to track orders, manage your wishlist, and enjoy instant checkout.",
    createAccountTitle: "Create Account",
    registerTitle: "Create Account",
    registerSubtitle: "Join SmartMart for exclusive deals, order tracking, and fast checkout.",
    emailLabel: "Email Address",
    emailPlaceholder: "name@example.com",
    phoneLabel: "Phone Number",
    phonePlaceholder: "e.g. 017XXXXXXXX",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter your password",
    rememberMe: "Remember Me",
    forgotPassword: "Forgot Password?",
    signInBtn: "Sign In",
    loginButton: "Sign In",
    signUpBtn: "Create Account",
    registerButton: "Create Account",
    submittingSignIn: "Signing in...",
    submittingSignUp: "Creating account...",
    orContinueWith: "OR",
    continueWithGoogle: "Continue with Google",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "e.g. Abir Hasan",
    agreeTerms: "I agree to the Terms & Conditions and Privacy Policy",
    passwordsMatch: "Passwords match",
    passwordsDoNotMatch: "Passwords do not match",
    strengthWeak: "Weak Password",
    strengthFair: "Fair Password",
    strengthStrong: "Strong Password",
    securityTitle: "Enterprise Security & Protection",
    securityDesc: "Your data is encrypted with 256-bit SSL security protocol.",
    trustHighlight1: "Official Warranty & Authenticity",
    trustHighlight2: "100% Cash on Delivery Guarantee",
    trustHighlight3: "24/7 Dedicated Customer Care",
  },
  bn: {
    // Navigation & Header
    logo: "স্মার্টমার্ট",
    tagline: "আপনার যা প্রয়োজন, দ্রুত পৌঁছে যাবে।",
    home: "হোম",
    products: "পণ্যসমূহ",
    cart: "কার্ট",
    login: "লগইন",
    register: "রেজিস্টার",
    logout: "লগআউট",
    dashboard: "ড্যাশবোর্ড",
    adminPanel: "অ্যাডমিন প্যানেল",
    searchPlaceholder: "পণ্য অনুসন্ধান করুন...",
    searchBtn: "খুঁজুন",

    // Hero & Stats
    heroTitle: "আনন্দের সাথে সেরা পণ্যসমূহ",
    heroDesc: "আপনার পণ্যকে আপনার জন্য জাদুকরী যত্ন নিতে দিন। আপনার চেহারা পরিবর্তন করে আপনার ব্যক্তিত্বের গুণমান পরিবর্তন করুন। সবকিছু আপনার চরিত্রকে প্রতিফলিত করে এবং আমরা এর যত্ন নিচ্ছি।",
    shopNow: "এখনই কিনুন",
    explore: "পণ্যসমূহ দেখুন",
    statProducts: "১০০০+ পণ্য",
    statCustomers: "৫০০০+ সুখী ক্রেতা",
    statDelivery: "ফ্রি ডেলিভারি",
    statSupport: "২৪/৭ সাপোর্ট",

    // Products Section
    productsHeading: "বিশেষ পণ্যসমূহ",
    productsSubheading: "প্রযুক্তি এবং প্রিমিয়াম মানের সেরা পণ্যগুলি আবিষ্কার করুন।",
    industrialMarketplace: "অফিসিয়াল স্টোর মার্কেটপ্লেস",
    buyNow: "এখনই কিনুন",
    addToCart: "কার্টে যোগ করুন",
    added: "যোগ হয়েছে",
    inStock: "স্টকে আছে",
    outOfStock: "স্টকে নেই",
    onlyLeft: "মাত্র {count} টি বাকি",
    off: "ছাড়",
    freeExpressDelivery: "ফ্রি ২৪ ঘণ্টা এক্সপ্রেস ডেলিভারি",
    clearFilters: "ফিল্টার মুছুন",
    noProductsFound: "কোনো পণ্য পাওয়া যায়নি",
    noProductsDesc: "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো পণ্য পাওয়া যায়নি।",
    viewDetails: "বিস্তারিত দেখুন",

    // Categories
    catAll: "সব",
    catElectronics: "ইলেকট্রনিক্স",
    catGadgets: "গ্যাজেটস",
    catAccessories: "এক্সেসরিজ",
    catSmartHome: "স্মার্ট হোম",

    // Product Details
    specifications: "বৈশিষ্ট্যসমূহ",
    warranty: "অফিসিয়াল ওয়ারেন্টি",
    quantity: "পরিমাণ",
    rating: "রেটিং",
    reviews: "রিভিউ",
    share: "শেয়ার করুন",
    relatedProducts: "সম্পর্কিত পণ্যসমূহ",
    recentlyViewed: "সাম্প্রতিক দেখা পণ্যসমূহ",
    customerReviews: "গ্রাহকদের মতামত ও মূল্যায়ন",
    backToProducts: "পণ্য তালিকায় ফিরে যান",
    inStockQuantity: "স্টকে মাত্র {count} টি আছে",
    highlightsTitle: "পণ্যের প্রধান বৈশিষ্ট্য ও সুবিধাসমূহ",
    premiumQuality: "১০০% খাঁটি ও প্রিমিয়াম কোয়ালিটি গ্যারান্টি",
    officialWarranty: "অফিসিয়াল ব্র্যান্ড ওয়ারেন্টি অন্তর্ভুক্ত",
    fastNationwideDelivery: "২৪-৪৮ ঘণ্টায় দ্রুত এক্সপ্রেস শিপিং",
    riskFreeCod: "ঝুঁকিমুক্ত ক্যাশ অন ডেলিভারি সুবিধা",
    easyReturns: "৭ দিনের সহজ রিটার্ন পলিসি",
    writeReview: "মতামত দিন",
    verifiedPurchase: "যাচাইকৃত ক্রেতা",
    skuLabel: "এসকেইউ (SKU)",
    brandLabel: "ব্র্যান্ড",
    officialBrand: "স্মার্টমার্ট অফিসিয়াল স্টোর",
    outOfStockTitle: "বর্তমানে স্টকে নেই",
    outOfStockDesc: "পণ্যটি বর্তমানে আউট অফ স্টক রয়েছে। শীঘ্রই পুনরায় স্টক করা হবে!",
    shareProduct: "শেয়ার করুন",
    linkCopied: "লিংক কপি করা হয়েছে!",
    zoomHint: "বড় করে দেখতে মাউস আনুন বা ফুলস্ক্রিন প্রিভিউতে ক্লিক করুন",
    productDescription: "পণ্যের বিবরণ",

    // Cart Page
    shoppingCart: "শপিং কার্ট",
    cartEmpty: "আপনার কার্ট খালি",
    cartEmptyDesc: "আপনি এখনো আপনার কার্টে কোনো পণ্য যোগ করেননি।",
    continueShopping: "কেনাকাটা চালিয়ে যান",
    subtotal: "সাবটোটাল",
    shipping: "ডেলিভারি চার্জ",
    grandTotal: "সর্বমোট",
    proceedToCheckout: "চেকআউটে যান",
    remove: "সরিয়ে ফেলুন",
    itemCount: "{count} টি পণ্য",

    // Checkout Page
    checkout: "চেকআউট",
    checkoutTitle: "চেকআউট ও অর্ডার বিবরণী",
    billingDetails: "ডেলিভারি তথ্য",
    fullName: "পূর্ণ নাম",
    emailAddress: "ইমেইল ঠিকানা",
    phoneNumber: "ফোন নম্বর",
    deliveryAddress: "সম্পূর্ণ ঠিকানা",
    district: "জেলা",
    thana: "থানা / উপজেলা",
    paymentMethod: "পেমেন্ট মাধ্যম",
    cashOnDelivery: "ক্যাশ অন ডেলিভারি",
    onlinePayment: "অনলাইন পেমেন্ট",
    placeOrder: "অর্ডার নিশ্চিত করুন",
    orderSummary: "অর্ডারের সারসংক্ষেপ",
    orderSuccess: "অর্ডার সফলভাবে গ্রহণ করা হয়েছে!",

    // Extended Checkout & Customer Form
    secureCheckout: "১০০% নিরাপদ চেকআউট",
    orderConfirmation: "অর্ডার নিশ্চিতকরণ",
    enterDeliveryInfo: "অর্ডার সম্পন্ন করতে নিচের ডেলিভারি তথ্য প্রদান করুন",
    fastDelivery: "দ্রুত ডেলিভারি",
    yourInfoAddress: "আপনার তথ্য ও ঠিকানা",
    customerNameLabel: "আপনার নাম *",
    customerNamePlaceholder: "আপনার পূর্ণ নাম লিখুন",
    customerNameHelper: "প্যাকেজের গায়ে গ্রাহক হিসেবে এই নামটি উল্লেখ থাকবে",
    altPhoneLabel: "বিকল্প মোবাইল (ঐচ্ছিক)",
    altPhonePlaceholder: "অন্য কোনো নম্বর",
    altPhoneHelper: "জরুরি প্রয়োজনে যোগাযোগের বিকল্প নম্বর",
    postalCodeLabel: "পোস্টাল কোড (ঐচ্ছিক)",
    postalCodePlaceholder: "যেমন: ১২০৫",
    districtLabel: "জেলা *",
    districtPlaceholder: "যেমন: ঢাকা, চট্টগ্রাম",
    thanaLabel: "উপজেলা / থানা *",
    thanaPlaceholder: "যেমন: ধানমন্ডি, গুলশান",
    addressLabel: "সম্পূর্ণ ঠিকানা *",
    addressPlaceholder: "বাসা নং, রোড নং, এলাকা বা গ্রাম...",
    addressHelper: "কুরিয়ার ডেলিভারি এজেন্ট সহজে যাতে ঠিকানা খুঁজে পায়",
    orderNoteLabel: "অর্ডার নোট (ঐচ্ছিক)",
    orderNotePlaceholder: "ডেলিভারি সংক্রান্ত বিশেষ কোনো বার্তা থাকলে লিখুন",
    placeOrderBtn: "অর্ডার নিশ্চিত করুন ({total})",
    processingOrder: "অর্ডার প্রক্রিয়াধীন...",
    productInfo: "পণ্যের তথ্য",
    estimatedDelivery: "🚀 আনুমানিক ডেলিভারি: ২ - ৪ কার্যদিবসের মধ্যে",
    originalSubtotal: "মূল মূল্য (সাবটোটাল)",
    discountSavings: "ছাড় সঞ্চয় (Discount Savings)",
    freeDelivery: "ফ্রি (Free Delivery)",
    totalPayable: "সর্বমোট দেয় টাকা",
    codGuaranteeTitle: "১০০% ঝুঁকিমুক্ত ক্যাশ অন ডেলিভারি",
    codGuaranteeDesc: "পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করার নিশ্চয়তা।",
    backToPrevious: "পিছনে ফিরুন",
    orderSuccessTitle: "অর্ডার সফল হয়েছে!",
    orderSuccessDesc: "ধন্যবাদ। খুব দ্রুত আমাদের প্রতিনিধি আপনার সাথে ফোন কলের মাধ্যমে যোগাযোগ করবে।",
    trustSecureCheckout: "১০০% নিরাপদ চেকআউট",
    trustCashOnDelivery: "ক্যাশ অন ডেলিভারি",
    trustFastDelivery: "২-৪ দিনে দ্রুত ডেলিভারি",
    trustEasyReturns: "৭ দিনের সহজ রিটার্ন",
    productNotFound: "পণ্যটি পাওয়া যায়নি",
    productNotFoundDesc: "অনুগ্রহ করে শপ পেইজ থেকে যেকোনো পণ্য নির্বাচন করে অর্ডার সম্পন্ন করুন।",
    cartEmptyTitle: "আপনার কার্ট খালি",
    cartEmptyDescription: "চেকআউট করতে আপনার কার্টে কোনো পণ্য যোগ করেননি।",

    // Form Validation Messages
    valName: "আপনার পুরো নাম লিখুন (কমপক্ষে ২ অক্ষর)",
    valPhone: "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)",
    valEmail: "সঠিক ইমেইল ঠিকানা লিখুন",
    valAddress: "বাসা নং, রোড নং, এলাকা সম্বলিত সম্পূর্ণ ঠিকানা লিখুন",
    valThana: "উপজেলা বা থানা লিখুন",
    valDistrict: "জেলার নাম লিখুন",
    valNoProductSelected: "কোনো পণ্য নির্বাচন করা হয়নি।",
    valOrderFailed: "অর্ডার সম্পন্ন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",

    // Toasts & Alerts
    cartEmptyToast: "আপনার কার্ট খালি",
    itemAddedToast: "পণ্য কার্টে যোগ করা হয়েছে",
    itemRemovedToast: "পণ্য কার্ট থেকে সরানো হয়েছে",
    loginSuccessToast: "সফলভাবে লগইন করা হয়েছে!",
    logoutSuccessToast: "সফলভাবে লগআউট করা হয়েছে",
    accessDeniedAdmin: "প্রবেশাধিকার সংরক্ষিত। শুধুমাত্র অ্যাডমিন অনুমোদিত।",
    loginToAccessDashboard: "অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন।",

    // Auth Pages (Login & Register)
    welcomeBack: "স্বাগতম",
    loginTitle: "স্বাগতম",
    loginSubtitle: "আপনার অর্ডার ট্র্যাক করতে, পছন্দের পণ্য সংরক্ষণ করতে এবং দ্রুত কেনাকাটা করতে লগইন করুন।",
    createAccountTitle: "একাউন্ট তৈরি করুন",
    registerTitle: "একাউন্ট তৈরি করুন",
    registerSubtitle: "স্মার্টমার্ট-এ যুক্ত হয়ে আকর্ষণীয় অফার ও অর্ডার ট্র্যাকিং সুবিধা উপভোগ করুন।",
    emailLabel: "ইমেইল ঠিকানা",
    emailPlaceholder: "name@example.com",
    phoneLabel: "ফোন নম্বর",
    phonePlaceholder: "যেমন: 017XXXXXXXX",
    passwordLabel: "পাসওয়ার্ড",
    passwordPlaceholder: "আপনার পাসওয়ার্ড লিখুন",
    confirmPasswordLabel: "পাসওয়ার্ড নিশ্চিত করুন",
    confirmPasswordPlaceholder: "পুনরায় পাসওয়ার্ড লিখুন",
    rememberMe: "পাসওয়ার্ড মনে রাখুন",
    forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
    signInBtn: "লগইন করুন",
    loginButton: "লগইন করুন",
    signUpBtn: "একাউন্ট খুলুন",
    registerButton: "একাউন্ট খুলুন",
    submittingSignIn: "লগইন করা হচ্ছে...",
    submittingSignUp: "একাউন্ট তৈরি হচ্ছে...",
    orContinueWith: "অথবা",
    continueWithGoogle: "গুগল দিয়ে প্রবেশ করুন",
    dontHaveAccount: "কোনো একাউন্ট নেই?",
    alreadyHaveAccount: "ইতিমধ্যে একাউন্ট আছে?",
    fullNameLabel: "পূর্ণ নাম",
    fullNamePlaceholder: "যেমন: আবির হাসান",
    agreeTerms: "আমি শর্তাবলী এবং গোপনীয়তা নীতিতে সম্মত",
    passwordsMatch: "পাসওয়ার্ড মিলেছে",
    passwordsDoNotMatch: "পাসওয়ার্ড মিলেনি",
    strengthWeak: "দুর্বল পাসওয়ার্ড",
    strengthFair: "মোটামুটি পাসওয়ার্ড",
    strengthStrong: "শক্তিশালী পাসওয়ার্ড",
    securityTitle: "নিরাপদ ও নির্ভরযোগ্য প্ল্যাটফর্ম",
    securityDesc: "আপনার তথ্য ২৫৬-বিট এসএসএল এনক্রিপশনের মাধ্যমে সম্পূর্ণ সুরক্ষিত।",
    trustHighlight1: "অফিসিয়াল ওয়ারেন্টি ও শতভাগ আসল পণ্য",
    trustHighlight2: "১০০% ক্যাশ অন ডেলিভারি সুবিধা",
    trustHighlight3: "২৪/৭ সার্বক্ষণিক গ্রাহক সেবা",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = React.useState<Language>("en");

  React.useEffect(() => {
    const storedLang = localStorage.getItem("smartmart-lang") as Language;
    if (storedLang === "en" || storedLang === "bn") {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("smartmart-lang", lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const langDict = dictionary[language];
    let val = (langDict as Record<string, string>)[key] || dictionary.en[key as keyof typeof dictionary.en] || key;

    if (params) {
      Object.entries(params).forEach(([pKey, pVal]) => {
        const formattedParam = typeof pVal === "number" ? formatNumber(pVal) : pVal;
        val = val.replace(new RegExp(`\\{${pKey}\\}`, "g"), String(formattedParam));
      });
    }

    return val;
  };

  const formatNumber = (num: number | string): string => {
    const str = String(num);
    if (language === "en") return str;
    return str.replace(/\d/g, (digit) => banglaDigits[digit] || digit);
  };

  const formatPrice = (amount: number): string => {
    const rounded = Math.round(amount);
    const formatted = formatNumber(rounded);
    return `৳${formatted}`;
  };

  const getLocalizedProduct = (product: any): LocalizedProduct => {
    if (!product) {
      return { name: "", description: "", category: "" };
    }

    let name = "";
    let description = "";
    let category = "";

    const descEn = (product.descriptionEn || "").trim();
    const descBn = (product.descriptionBn || "").trim();
    const descBase = (product.description || "").trim();

    if (language === "bn") {
      name = product.nameBn || product.name || product.nameEn || "";
      // Prefer Bangla description; if empty, fallback to English, then base description
      description = descBn || descEn || descBase;
      const rawCat = product.categoryBn || product.category || "";
      category = categoryTranslationMap[rawCat]?.bn || rawCat;
    } else {
      name = product.nameEn || product.name || product.nameBn || "";
      // Prefer English description; if empty, fallback to Bangla, then base description
      description = descEn || descBn || descBase;
      const rawCat = product.categoryEn || product.category || "";
      category = categoryTranslationMap[rawCat]?.en || rawCat;
    }

    return { name, description, category };
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatNumber,
        formatPrice,
        getLocalizedProduct,
      }}
    >
      <div lang={language}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = React.useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
