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
  const usedIdsPath = `./scripts/mock/${
    contract === "seekers" ? "usedIdsSeekers" : "usedIdsTNL"
  }.json`;
  const usedIds = JSON.parse(fs.readFileSync(usedIdsPath, "utf8"));

  const _contract = contract === "seekers" ? "TestSeekers" : "GoerliTNL";

  console.log(`Minting ${amount} ${_contract} to address: ${address}`);
  try {
    for (let i = 0; i < amount; i++) {
      tokenIds.push(getRandomTokenId(1, 5661, usedIds));
    }

    const MockFactory = await ethers.getContractFactory(_contract);
    const mock = MockFactory.attach(
      contract === "seekers" ? SeekersAddress : TnlAddress
    );

    for (const tokenId of tokenIds) {
      const tx = await mock.mint(address, tokenId);
      console.log(`minting ${tokenId}, txHash: ${tx.hash}`);
      await tx.wait();
    }

    console.log("writing to usedIds.json");
    fs.writeFileSync(usedIdsPath, JSON.stringify(tokenIds.concat(usedIds)));
  } catch (err: any) {
    console.log(err);
    if (err?.message?.includes("NETWORK_ERROR")) return;

    console.log("writing to usedIds.json");
    fs.writeFileSync(usedIdsPath, JSON.stringify(tokenIds.concat(usedIds)));
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
