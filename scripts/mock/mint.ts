import fs from "fs";

interface TaskArgs {
  address: string;
  amount: number;
  contract: "seekers" | "tnl";
}

const SeekersAddress = "0x1caC32d9893deCA7769A2E64edC186163125d43b";
const TnlAddress = "0x5085CC0236ae108812571eADF24beeE4fe8E0c50";

export default async function main(
  ethers: any,
  { address, amount, contract }: TaskArgs
) {
  let tokenIds: number[] = [];
  const usedIds = JSON.parse(
    fs.readFileSync("./scripts/mock/usedIds.json", "utf8")
  );

  console.log(`Minting ${amount} mock to address: ${address}`);
  try {
    for (let i = 0; i < amount; i++) {
      tokenIds.push(getRandomTokenId(1, 5661, usedIds));
    }

    const MockFactory = await ethers.getContractFactory(
      contract === "seekers" ? "TestSeekers" : "GoerliTNL"
    );
    const mock = MockFactory.attach(
      contract === "seekers" ? SeekersAddress : TnlAddress
    );

    for (const tokenId of tokenIds) {
      const tx = await mock.mint(address, tokenId);
      console.log(`minting ${tokenId}, txHash: ${tx.hash}`);
      await tx.wait();
    }

    console.log("writing to usedIds.json");
    fs.writeFileSync(
      "./scripts/mock/usedIds.json",
      JSON.stringify(tokenIds.concat(usedIds))
    );
  } catch (err) {
    console.log(err);
    console.log("writing to usedIds.json");
    fs.writeFileSync(
      "./scripts/mock/usedIds.json",
      JSON.stringify(tokenIds.concat(usedIds))
    );
    process.exit(1);
  }
}

function getRandomTokenId(
  min: number,
  max: number,
  usedIds: Array<number>
): number {
  const tokenId = Math.floor(Math.random() * (max - min + 1) + min);
  if (usedIds.includes(tokenId)) return getRandomTokenId(min, max, usedIds);

  return tokenId;
}
