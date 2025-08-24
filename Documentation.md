# Documentacion Midnauction


## Resumen

Despues de hacer un analisis de las posibilidades que ofrece Midnight y la maquinaria ya construida, llegamos a la conclusion de que es un entorno ideal para el desarrollo de subastas privadas.

Construimos una **subasta sellada por rondas** en Compact, aprovechando el mecanismo de **commitments** y ZKPs para mantener privados la identidad real de los participantes hasta la fase de revelación.

Nuestra herramienta permite a un seller listar un producto, ejecutar `N` rondas de pujas selladas, en donde tanto los montos ofertados como las identidades de los bidders se mantienen privadas. Los montos se revelan todos juntos al final de cada ronda y, en la última, permitir que el ganador publique un dato de contacto cifrado para coordinar el settlement off-chain o en otra dApp con el seller.

Este modelo de subasta permite ir ajustando el precio del asset con el correr de las rondas, ya que los bidders usan el conjunto de ofertas de una ronda como insumo para ofertar en la ronda siguiente, convergiendo a un precio optimo. El ganador de la subasta sera el que haga la mayor oferta en la ultima ronda.

Cabe aclarar que, a pesar de haber sido este el modelo elegido, este framework se puede usar para implementar cualquier otro tipo de subasta agregando privacidad.

## Casos de uso

Nuestra propuesta agrega un enorme valor porque replica un mecanismo ya utilizado en el mundo real: muchos gobiernos, tanto a nivel nacional como regional, licitan obras públicas, concesiones y servicios estratégicos mediante este tipo de subastas. Este esquema garantiza transparencia, competencia justa y descubrimiento eficiente de precios, a la vez que protege la confidencialidad de los participantes hasta el momento adecuado. Llevar este modelo a la blockchain permite no solo digitalizar un proceso ampliamente conocido por el sector público y privado, sino también dotarlo de seguridad criptográfica, inmutabilidad y verificabilidad abierta, ampliando la confianza en licitaciones y generando oportunidades de negocio más transparentes y competitivas.


Además, este tipo de subasta tiene un enorme potencial en el mundo empresarial B2B: cuando una gran empresa terceriza servicios logísticos, contrata proveedores de materias primas o busca alianzas estratégicas, la confidencialidad de las ofertas y la no-colusión entre competidores son absolutamente clave. Por ejemplo, una automotriz que quiere seleccionar a su proveedor de baterías puede abrir una subasta privada en varias rondas, eligiendo de manera justa, evitando acuerdos ocultos y manteniendo la trazabilidad de todo el proceso en blockchain.

---

## Roles y componentes

### Roles

* **Auctioneer (owner):** crea el contrato, define el numero de rondas y controla los tiempos de oferta y de revelacion.
* **Participantes:** ofertan de forma sellada y revelan su oferta dependiendo de la etapa.
* **Contrato:** guarda estado mínimo y verifica proofs o commitments.

**Parametros del contrato (ledger)**

* `productName`, `productDescription`: metadatos del ítem en venta.
* `rounds` / `currentRound`: cantidad total de rondas e indicador (inicia en 1).
* `phase`: `commitment`, `revealing` o `finished` dependiendo del momento de la subasta. En `commitment`, los bidders suben sus ofertas privadas. En `revealing` esas ofertas se revelan sin mostrar las addresses de los bidders, y en `finished` se termina la subasta.
* `auctioneerPK`: clave pública del subastador.
* `registeredParticipants`: Commitments de los bidders.
* `secretBids`: Ofertas **encriptadas** de la ronda.
* `revealedBids`: Montos **desencriptados** de la última ronda.
* `winnerEncryptedPublicKey`: dato de contacto del ganador cifrado con la clave publica del auctioneer. Esto hace que solo el owner del contrato pueda ver saber quien es el ganador.


---

## Workflow

```
Ronda 1..N:
  [Fase: commitment]
    - Participante calcula:
        bidCommit = commit(value, bidNonce)
        idCommit  = commit(secretKey(), idNonce)
    - Envía su oferta mediante estos 2 commitments.
      * En la ronda 1, queda “registrado” idCommit.
      * En rondas siguientes, debe reutilizar el mismo idNonce para que idCommit coincida.
  [Owner] Pasa a la reveal phase.

  [Fase: revealing]
    - Participante revela que ofertó `value` dando bidNonce y value.
      * El contrato verifica que (bidCommit, idCommit) estan en los commitments recibidos en la fase de commitment.
      * Guarda `value` en revealedBids (público).
  [Si no es la última ronda] moveToNextPhase() → limpia sets y avanza currentRound

Última ronda:
  [Fase: revealing]
    - Ganador llama claimWin(value, bidNonce, idNonce, encryptedPublicKey)
      * Verifica que su par comprometido existe.
      * Publica `winnerEncryptedPublicKey` para contacto seguro.
  
  [Fase: finished]
    - Cuando el ganador envia su clave publica, el Owner puede cerrar la subasta.
```


## Interfaz del contrato

### `commitSecretBid(value: Uint<64>, bidNonce: Bytes<32>, idNonce: Bytes<32>)`

* **Cuándo:** fase `commitment`.
* **Qué hace:** registra el par `(commit(valor), commit(identidad))`. En la ronda 1 agrega `idCommit` a `registeredParticipants`.
* **Checks/errores:**
  * Fase correcta.
  * Si `currentRound == 1`, te registra; si no, **debes estar ya registrado**.
  * Inserta en `secretBids`.

### `moveToRevealPhase()`

* **Rol:** **solo owner** (requiere `Ownable_assertOnlyOwner()`).
* **Qué hace:** cambia `phase` a `revealing`.

### `revealBid(value, bidNonce, idNonce)`

* **Cuándo:** fase `revealing`.
* **Qué hace:** recomputa los compromisos y verifica que el par fue comprometido. Si es válido, guarda `value` en `revealedBids` para que sea visible para todos los participantes.

### `moveToNextPhase()`

* **Cuándo:** al finalizar la revelación de una ronda que **no** es la última.
* **Qué hace:** limpia `secretBids` y `revealedBids`, incrementa `currentRound`, vuelve a la fase `commitment`.


### `claimWin(value, bidNonce, idNonce, encryptedPublicKey)`

* **Cuándo:** fase `revealing` de la **última ronda** (`currentRound == rounds`).
* **Qué hace:** verifica que el (bidCommit, idCommit) existía y guarda `winnerEncryptedPublicKey`.
* **Uso:** publicar un medio de contacto cifrado (p. ej. una clave pública efímera) para coordinar settlement.

### `finishAuction()`

* **Cuándo:** fase `revealing` de la **última ronda** (`currentRound == rounds`), una vez que el ganador publica su clave publica encriptada.
* **Qué hace:** termina la subasta.


## Privacidad

* **Compromisos persistentes** (`persistentCommit`): te permiten **probar** que conocías un valor en el momento del commit sin revelarlo. En `revealBid` demuestras coherencia entregando `value` y el `bidNonce`.
* **Identidad pseudónima:** `idCommit = commit(secretKey(), idNonce)`. El contrato no conoce tu `secretKey()`.
* **Privacidad por fases:** en `commitment`, ni montos ni identidades reales son visibles; en `revealing` se hacen públicos **solo los montos** que se revelen.

## Libertades ACE abordadas

**Freedom of Commerce**: Las pujas son tratadas como transacciones privadas, donde cada oferta se compromete criptograficamente y solo se revela en el momento adecuado. Esto protege la estrategia comercial de los participantes y evita colusión, habilitando procesos de compra con máxima transparencia y confidencialidad.

**Freedom of Association**: El mecanismo de registro mediante identidades pseudónimas (idCommit) asegura que un grupo de participantes pueda competir en igualdad de condiciones sin exponer públicamente quiénes son, fomentando colaboraciones y competencia justa en entornos sensibles.

## Componentes clave integrados

**OpenZeppelin Integration (Security & Reusability)**: El contrato hereda la estructura de Ownable de OpenZeppelin para controles de acceso, garantizando que la gestión de fases esté bajo un rol autorizado. Esto demuestra cómo los estándares probados de seguridad pueden combinarse con Compact para construir bloques reutilizables en entornos ZK.

**Secure Data Sharing (Privacy-Preserving Exchange)**: Toda la lógica commit–reveal implementa selective disclosure: se comparte la existencia de un compromiso en la fase de puja, pero solo un dato, el valor ofertado es revelado. Al final, el ganador publica una clave pública cifrada para coordinar off-chain, mostrando un flujo real de intercambio controlado de datos confidenciales.

**Developer Enablement (Tooling Enhancement)**: Nuestro contrato está diseñado como un bloque modular y reutilizable que otros desarrolladores pueden tomar como base para construir sus propias dApps en Midnight. El patrón de commit–reveal con identidades pseudónimas y control de fases sirve no solo para subastas, sino también para votaciones privadas, concursos o juegos de pujas, por lo que nuestro proyecto facilita su adopcion.

**Zero-Knowledge Verification (Attribute Proofs)**: El uso de persistent commitments funciona como prueba de conocimiento sin revelar secretos. Los participantes demuestran que conocían su oferta e identidad desde la fase de compromiso, sin exponer claves privadas. Esto es un caso práctico de “rational privacy” aplicado a comercio.


