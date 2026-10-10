// import { Nav, NavUl } from "../components";
// import { NavList, NavCategoryList } from "./nav-desktop-list";

// import { CategoryPopover } from "../../../components/category-popover";

// // ----------------------------------------------------------------------

// export function NavDesktop({
//   categories,
//   mainNavData,
//   secondaryNavData,
//   sx,
//   ...other
// }) {
//   return (
//     <Nav
//       sx={[
//         () => ({
//           /* Put styles */
//           alignItems: "center",
//           justifyContent: "space-between",
//         }),
//         ...(Array.isArray(sx) ? sx : [sx]),
//       ]}
//       {...other}
//     >
//       <CategoryPopover categories={categories} />

//       <NavUl
//         sx={{
//           gap: 5,
//           height: 1,
//           flexDirection: "row",
//           alignItems: "center",
//         }}
//       >
//         {mainNavData.map((list) => (
//           <NavList key={list.title} data={list} />
//         ))}

//         {categories?.map((category) => (
//           <NavCategoryList key={category.category_id} category={category} />
//         ))}
//       </NavUl>

//       <NavUl
//         sx={{
//           gap: 5,
//           height: 1,
//           flexDirection: "row",
//           alignItems: "center",
//         }}
//       >
//         {secondaryNavData.map((list) => (
//           <NavList key={list.title} data={list} />
//         ))}
//       </NavUl>
//     </Nav>
//   );
// }
import { Nav, NavUl } from "../components";
import { NavList, NavCategoryList } from "./nav-desktop-list";

import { CategoryPopover } from "../../../components/category-popover";
import Link from "next/link";
import { paths } from "@/routes/paths";

// ----------------------------------------------------------------------

export function NavDesktop({
  categories,
  mainNavData,
  secondaryNavData,
  className,
  ...other
}) {
  return (
    <Nav
      className={[
        // !important overrides any default flex-col the Nav component may apply
        "lg:!flex lg:!flex-row items-center justify-center hidden w-full py-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...other}
    >
      {/* <CategoryPopover categories={categories} /> */}

      {/* gap: 5 (5×8=40px), height: 1 (100%), flex-row, items-center */}
      <NavUl className="!flex !flex-row h-full items-center gap-10">
        {mainNavData.map((list) => (
          <NavList key={list.title} data={list} />
        ))}

        {categories?.map((category) => (
          <NavCategoryList key={category.category_id} category={category} />
        ))}
      </NavUl>

      {/* Same layout as the main NavUl */}
      <NavUl className="!flex !flex-row h-full items-center !justify-center gap-10">
        {secondaryNavData?.map((list) => (
          <NavList key={list.title} data={list} />
        ))}
        <NavList className="ml-8!" data={{ title: "Contact", path: paths.contact }} />
      </NavUl>

    </Nav>
  );
}