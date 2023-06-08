import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import { VaultCreated } from "../generated/CreditDelegationVaultFactory/CreditDelegationVaultFactory"

export function createVaultCreatedEvent(
  vault: Address,
  owner: Address
): VaultCreated {
  let vaultCreatedEvent = changetype<VaultCreated>(newMockEvent())

  vaultCreatedEvent.parameters = new Array()

  vaultCreatedEvent.parameters.push(
    new ethereum.EventParam("vault", ethereum.Value.fromAddress(vault))
  )
  vaultCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return vaultCreatedEvent
}
