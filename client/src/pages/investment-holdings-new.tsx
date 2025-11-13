// This is a temporary file containing the new Holdings tab design
// It will be used to replace the Holdings TabsContent in investment.tsx

const HoldingsTabNew = `
        {/* Holdings Tab */}
        <TabsContent value="holdings" className="mt-0 px-4 pb-6 space-y-6">
          {/* Portfolio Summary Card */}
          <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Total Portfolio Value</p>
                <div className="flex items-center gap-2">
                  {totalGainLoss >= 0 ? <TrendingUp className="h-3 w-3 text-white/60" /> : <TrendingDown className="h-3 w-3 text-white/60" />}
                  <span className="text-xs text-white/60">{gainLossPercent >= 0 ? "+" : ""}{gainLossPercent.toFixed(2)}%</span>
                </div>
              </div>
              <p className="text-4xl font-light text-white tracking-tight">
                {formatCurrency(portfolioValue)}
              </p>
              
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                <div className="space-y-1">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Invested</p>
                  <p className="text-lg font-light text-white">{formatCurrency(investedValue)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Returns</p>
                  <p className="text-lg font-light text-white">{formatCurrency(Math.abs(totalGainLoss))}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Gain/Loss</p>
                  <p className="text-lg font-light text-white">{gainLossPercent >= 0 ? "+" : ""}{gainLossPercent.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sub Tabs */}
          <div className="border-b border-white/10">
            <div className="flex gap-0 overflow-x-auto">
              {["all", "stocks", "crypto", "gold", "silver", "diamond"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setHoldingsSubTab(tab)}
                  className={cn(
                    "px-4 py-3 text-[10px] uppercase tracking-widest font-light border-b-2 whitespace-nowrap transition-colors",
                    holdingsSubTab === tab 
                      ? "border-white text-white" 
                      : "border-transparent text-white/50 hover:text-white/70"
                  )}
                  data-testid={\`button-holdings-\${tab}\`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Holdings List */}
          <div className="space-y-3">
            {portfolioLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent p-4">
                    <Skeleton className="h-20 w-full bg-white/10" />
                  </div>
                ))}
              </>
            ) : portfolioItems.length === 0 ? (
              <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent p-8 text-center">
                <BarChart3 className="h-12 w-12 text-white/40 mx-auto mb-3" />
                <p className="text-sm text-white/60 mb-1 font-light tracking-wide">No holdings yet</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Start investing to build your portfolio</p>
              </div>
            ) : (
              paginatedPortfolio
                .filter(item => {
                  if (holdingsSubTab === "all") return true;
                  if (holdingsSubTab === "stocks") return item.investmentType === "Stock";
                  if (holdingsSubTab === "crypto") return item.investmentType === "Crypto";
                  if (holdingsSubTab === "gold") return item.symbol.includes("GOLD");
                  if (holdingsSubTab === "silver") return item.symbol.includes("SILVER");
                  if (holdingsSubTab === "diamond") return item.symbol.includes("DIAMOND");
                  return true;
                })
                .map((item) => {
                  const currentValue = parseFloat(item.currentValue || "0");
                  const totalInvested = parseFloat(item.totalInvested || "0");
                  const gainLoss = parseFloat(item.gainLoss || "0");
                  const gainLossPercent = parseFloat(item.gainLossPercentage || "0");
                  const quantity = parseFloat(item.quantity || "0");
                  const avgPrice = parseFloat(item.avgPrice || "0");
                  
                  return (
                    <div
                      key={item.id}
                      className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedAsset(item);
                        setDetailSheetOpen(true);
                      }}
                      data-testid={\`card-holding-\${item.symbol}\`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-light text-white text-sm tracking-wide">{item.symbol}</h4>
                              <span className="px-2 py-0.5 bg-white/10 border border-white/20 text-[10px] text-white/70 uppercase tracking-widest">
                                {item.investmentType}
                              </span>
                            </div>
                            <p className="text-[10px] text-white/50 tracking-wide">{item.instrumentName}</p>
                            <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">{quantity} units @ ₹{avgPrice.toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-light text-white tracking-tight mb-1">{formatCurrency(currentValue)}</p>
                            <div className="flex items-center gap-1 justify-end">
                              {gainLoss >= 0 ? 
                                <TrendingUp className="h-3 w-3 text-white/50" /> : 
                                <TrendingDown className="h-3 w-3 text-white/50" />
                              }
                              <span className="text-[10px] font-light text-white/50">
                                {gainLoss >= 0 ? "+" : ""}{gainLossPercent.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-white/10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAsset(item);
                              setBuyDialogOpen(true);
                            }}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/20 hover:bg-white/10 text-white text-[10px] uppercase tracking-widest font-light transition-all"
                            data-testid={\`button-buy-\${item.symbol}\`}
                          >
                            Buy More
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAsset(item);
                              setSellDialogOpen(true);
                            }}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/20 hover:bg-white/10 text-white text-[10px] uppercase tracking-widest font-light transition-all"
                            data-testid={\`button-sell-\${item.symbol}\`}
                          >
                            Sell
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}

            {/* Pagination */}
            {portfolioItems.length > 10 && (
              <PaginationControls
                currentPage={portfolioPage}
                totalPages={portfolioTotalPages}
                onPageChange={goToPortfolioPage}
                canGoNext={canGoNextPortfolio}
                canGoPrevious={canGoPreviousPortfolio}
                startIndex={portfolioStartIndex}
                endIndex={portfolioEndIndex}
                totalItems={portfolioTotalItems}
              />
            )}
          </div>
        </TabsContent>
`;

export default HoldingsTabNew;
