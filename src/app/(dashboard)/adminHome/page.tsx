import { db } from "@/server/db";
import { contracts, members } from "@/server/db/schema/members";
import { currentUser } from "@clerk/nextjs";
import { desc, eq, lt, sql } from "drizzle-orm";
import { DateTime } from "luxon";
import { redirect } from "next/navigation";
import { DataTableWithColumns, type User } from "./columns";
import CustomButton from "./customButton";
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
  const today = DateTime.now().setZone("America/Chicago").toJSDate();
  await db.execute(sql`UPDATE ${contracts}
  SET ${contracts.status} = (
    CASE
      WHEN ${contracts.remainingDays} = 0 THEN 'Inactive'
      ELSE ${contracts.status}
    END
  )
  WHERE ${contracts.remainingDays} IS NOT NULL;`);

  await db
    .update(contracts)
    .set({ status: "Inactive" })
    .where(lt(contracts.endDate, today));

  await db.execute(sql`UPDATE ${members}
  SET ${members.contractStatus} =
      CASE
          WHEN EXISTS (
              SELECT 1
              FROM ${contracts}
              WHERE ${members.customerId} = ${contracts.ownerId}
              AND ${contracts.status} != 'Inactive'
          ) THEN (
            SELECT CONCAT('Active: ', ${contracts.type})
            FROM ${contracts}
            WHERE ${members.customerId} = ${contracts.ownerId}
            AND ${contracts.status} != 'Inactive'
            LIMIT 1
        )
          WHEN NOT EXISTS (
              SELECT 1
              FROM ${contracts}
              WHERE ${members.customerId} = ${contracts.ownerId}
          ) THEN 'None'
          ELSE 'Inactive'
      END;`);
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
  const user = await currentUser();
  const data = await getData();
  const products = await getProducts();
  // console.log(products);
  if (!user?.emailAddresses[0]) {
    redirect("/sign-in");
  }

  const checkAdmin = await db.query.members.findFirst({
    where: eq(members.emailAddress, user.emailAddresses[0].emailAddress),
    columns: {
      isAdmin: true,
    },
  });
  if (!checkAdmin) {
    redirect("/memberHome");
  }

  if (checkAdmin?.isAdmin === false) {
    redirect("/memberHome");
  }

  await checkContracts();

  return (
    <>
      <div className="flex flex-col">
        {/* <div className="flex justify-end">
          <UserButton afterSignOutUrl="/" />
        </div> */}
        <div className="flex flex-row m-auto space-x-4">
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
