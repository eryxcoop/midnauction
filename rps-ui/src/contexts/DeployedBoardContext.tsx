// This file is part of midnightntwrk/example-counter.
// Copyright (C) 2025 Midnight Foundation
// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License");
// You may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React, { type PropsWithChildren, createContext } from 'react';
import { type DeployedRPSAPIProvider, BrowserDeployedRPSManager } from './BrowserDeployedBoardManager';
import { type Logger } from 'pino';

/**
 * Encapsulates a deployed RPS provider as a context object.
 */
export const DeployedRPSContext = createContext<DeployedRPSAPIProvider | undefined>(undefined);

/**
 * The props required by the {@link DeployedRPSProvider} component.
 */
export type DeployedRPSProviderProps = PropsWithChildren<{
  /** The `pino` logger to use. */
  logger: Logger;
}>;

/**
 * A React component that sets a new {@link BrowserDeployedRPSManager} object as the currently
 * in-scope deployed RPS provider.
 */
export const DeployedRPSProvider: React.FC<Readonly<DeployedRPSProviderProps>> = ({ logger, children }) => (
  <DeployedRPSContext.Provider value={new BrowserDeployedRPSManager(logger)}>
    {children}
  </DeployedRPSContext.Provider>
);
