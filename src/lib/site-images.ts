export const heroImages = [
  "/new/shallow-focus-shot-white-female-reading-bible-bright-rays-sun.jpg",
  "/new/hands-folded-prayer-holy-bible-church.jpg",
  "/new/group-four-gorgeous-african-american-womans-wear-summer-hat-holding-hands-praying-green-grass-park.jpg",
] as const;

export const ministryGalleryImages = [...heroImages] as const;

export const blogCoverImages = [
  "/new/confident-serious-person-holding-hands-prayer-talk-god.jpg",
  "/new/group-four-gorgeous-african-american-womans-wear-summer-hat-holding-hands-praying-green-grass-park.jpg",
  "/new/hands-folded-prayer-holy-bible-church.jpg",
  "/new/shallow-focus-shot-white-female-reading-bible-bright-rays-sun.jpg",
  "/new/young-woman-reading-outdoors.jpg",
] as const;

export const pageHeroImages = {
  about: heroImages[0],
  visit: heroImages[0],
  contact: heroImages[1],
  watch: heroImages[1],
  connect: heroImages[2],
  competitions: blogCoverImages[1],
  privacy: blogCoverImages[0],
  terms: blogCoverImages[3],
} as const;