import { VaultCreated as VaultCreatedEvent } from "../generated/CreditDelegationVaultFactory/CreditDelegationVaultFactory";
import { Vault, Owner, Manager, DebtToken } from "../generated/schema";
import { CreditDelegationVault as CreditDelegationVaultContract } from "../generated/templates/CreditDelegationVault/CreditDelegationVault";
import { CreditDelegationVault, AaveDebtToken } from "../generated/templates";

export function handleVaultCreated(event: VaultCreatedEvent): void {
  let vault = new Vault(event.params.vault.toHexString());

  vault.vault = event.params.vault;
  vault.owner = event.params.owner.toHexString();
  vault.createdAt = event.block.timestamp;
  let vaultContract = CreditDelegationVaultContract.bind(event.params.vault);
  vault.atomicaPool = vaultContract.ATOMICA_POOL();
  vault.asset = vaultContract.getUnderlyingAsset();

  const debtTokenAddress = vaultContract.DEBT_TOKEN();
  const managerAddress = vaultContract.manager();
  vault.manager = managerAddress.toHexString();
  vault.debtToken = debtTokenAddress;
  vault.save();

  let owner = Owner.load(event.params.owner.toHexString());
  if (!owner) {
    owner = new Owner(event.params.owner.toHexString());
    owner.save();
  }

  let manager = Manager.load(managerAddress.toHexString());
  if (!manager) {
    manager = new Manager(managerAddress.toHexString());
    manager.save();
  }

  // Create vault proxy template
  CreditDelegationVault.create(event.params.vault);
  // Create debt token template if doesnt exist
  let debtToken = DebtToken.load(debtTokenAddress.toHexString());
  if (!debtToken) {
    debtToken = new DebtToken(debtTokenAddress.toHexString());
    debtToken.save();
    AaveDebtToken.create(debtTokenAddress);
  }
}
