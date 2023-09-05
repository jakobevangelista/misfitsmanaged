import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import { User } from "./columns";
import { DataTable } from "./data-table";
import { db } from "@/db";
import { eq, lt, sql } from "drizzle-orm";
import { members, contracts, products } from "@/db/schema/members";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RefreshPage } from "./refresh-page";
import { customCheckoutPost, postData } from "../../../utils/helpers";
import CustomButton from "./customButton";
import { DataTableWithColumns } from "./columns";
import { stripe } from "../../../utils/stripe";
import { desc } from "drizzle-orm";
export const revalidate = 2; // revalidate this page every 2 seconds
// export const dynamic = "force-dynamic";

async function getData(): Promise<User[]> {
  // Fetch data from your API here.
  const users: User[] = await db.query.members.findMany({
    columns: {
      id: true,
      realScanId: true,
      name: true,
      contractStatus: true,
      emailAddress: true,
      profilePicture: true,
    },
    orderBy: [desc(members.id)],
  });

  return users;
}

async function checkContracts() {
  const today = new Date();

  // await db.execute(sql`UPDATE ${members}
  // LEFT JOIN ${contracts} ON ${members.customerId} = ${contracts.ownerId}
  // SET ${members.contractStatus} = COALESCE(${contracts.status}, 'none');`);
  await db
    .update(contracts)
    .set({ status: "Inactive" })
    .where(lt(contracts.endDate, today));

  // await db.execute(sql`update ${members}
  // set ${members.contractStatus} = (
  //   case
  //     when (
  //       select ${contracts.status}
  //       from ${contracts}
  //       where ${contracts.ownerId} = ${members.customerId} AND ${contracts.status} = 'active' OR ${contracts.status} = 'limited'
  //       limit 1
  //     ) is not null then 'active'
  //     else 'none'
  //   END
  // )`);

  await db.execute(sql`UPDATE ${contracts}
  SET ${contracts.status} = (
    CASE
      WHEN ${contracts.remainingDays} = 0 THEN 'Inactive'
      ELSE ${contracts.status}
    END
  )
  WHERE ${contracts.remainingDays} IS NOT NULL;`);
  // await db.execute(sql`UPDATE ${members}
  // JOIN ${contracts} ON ${members.customerId} = ${contracts.ownerId}
  // SET ${members.contractStatus} = CASE
  //   WHEN ${contracts.status} = 'active' THEN 'Active'
  //   ELSE ${members.contractStatus}
  // END
  // WHERE ${contracts.status} = 'active';`);

  // await db.execute(sql`UPDATE ${members}
  // LEFT JOIN ${contracts} ON ${members.customerId} = ${contracts.ownerId}
  // SET ${members.contractStatus} = COALESCE(
  //   CASE
  //     WHEN ${contracts.status} = 'active' THEN 'Active: ${contracts.type}'
  //     ELSE ${members.contractStatus}
  //   END,
  //   'none'
  // );`);

  await db.execute(sql`UPDATE ${members}
SET ${members.contractStatus} = (
  SELECT CONCAT('Active: ', ${contracts.type})
  FROM ${contracts}
  WHERE ${contracts.ownerId} = ${members.customerId}
    AND ${contracts.status} = 'active'
  LIMIT 1
)
WHERE EXISTS (
  SELECT 1
  FROM ${contracts}
  WHERE ${contracts.ownerId} = ${members.customerId}
    AND ${contracts.status} = 'active'
  LIMIT 1
);`);
}

async function getProducts() {
  // LOL THIS CRASHES PROD

  // const stripeProductList = await stripe.products.list({
  //   active: true,
  //   limit: 100,
  // });
  // // console.log(stripeProductList.data);
  // for (const product of stripeProductList.data) {
  //   const stripePrice = await stripe.prices.retrieve(
  //     product.default_price as string
  //   );
  //   await db
  //     .insert(products)
  //     .values({
  //       priceId: product.default_price!.toString(),
  //       name: product.name,
  //       price: stripePrice!.unit_amount!,
  //     })
  //     .onDuplicateKeyUpdate({
  //       set: {
  //         name: product.name,
  //         price: stripePrice!.unit_amount!,
  //       },
  //     });
  // }

  const dbProducts = await db.query.products.findMany({
    columns: {
      name: true,
      priceId: true,
      price: true,
    },
  });

  return dbProducts;
}

export default async function AdminHome() {
  const { userId } = auth();
  const user = await currentUser();
  const data = await getData();
  const products = await getProducts();
  // console.log(products);

  const checkAdmin = await db.query.members.findFirst({
    where: eq(members.userId, userId!),
    columns: {
      isAdmin: true,
    },
  });

  if (checkAdmin?.isAdmin === false) {
    redirect("/memberHome");
  }

  checkContracts();

  return (
    <>
      <RefreshPage />
      <div className="flex flex-col">
        <div className="flex justify-end">
          <UserButton afterSignOutUrl="/" />
        </div>
        <div className="flex flex-row m-auto space-x-4">
          <Button className="mx-auto my-4" asChild>
            <Link href="/memberHome">Go to Member View</Link>
          </Button>

          <Button variant="creme" className="mx-auto my-4" asChild>
            <a href="/transactions">Go to Transactions</a>
          </Button>

          <CustomButton />
        </div>
        <div className="mx-auto my-10 ">
          {/* <DataTable columns={columns} data={data} /> */}
          <DataTableWithColumns data={data} products={products} />
        </div>
      </div>
    </>
  );
}
